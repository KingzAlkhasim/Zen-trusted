import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function json(res: any, status: number, body: unknown) {
  res.status(status).setHeader('Content-Type', 'application/json').json(body);
}

function getBearerToken(req: any) {
  const header = req.headers?.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7).trim() : null;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return json(res, 405, { error: 'Method not allowed.' });
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return json(res, 500, { error: 'Server authentication is not configured.' });
  }

  const token = getBearerToken(req);
  if (!token) return json(res, 401, { error: 'Authentication required.' });

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Always verify the access token with Supabase Auth. Do not trust
  // client-side session data when authorizing a server request.
  const {
    data: { user },
    error: userError,
  } = await adminClient.auth.getUser(token);

  if (userError || !user) return json(res, 401, { error: 'Invalid or expired session.' });

  const { data: adminProfile, error: profileError } = await adminClient
    .from('gv_profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error('Admin profile lookup failed:', profileError.message);
    return json(res, 500, { error: 'Could not verify admin access.' });
  }

  if (adminProfile?.role !== 'admin') {
    return json(res, 403, { error: 'Admin access required.' });
  }

  if (req.method === 'GET') {
    const users: Array<{
      id: string;
      username: string;
      email: string;
      role: string;
      created_at: string;
    }> = [];

    // Auth users are paginated. Keep fetching until the final page so the
    // admin dashboard does not silently miss users once the app grows.
    for (let page = 1; page <= 100; page += 1) {
      const { data, error } = await adminClient.auth.admin.listUsers({
        page,
        perPage: 1000,
      });

      if (error) {
        console.error('Failed to list auth users:', error.message);
        return json(res, 500, { error: 'Could not load registered users.' });
      }

      for (const authUser of data.users) {
        users.push({
          id: authUser.id,
          username:
            (authUser.user_metadata?.username as string | undefined) ||
            authUser.email?.split('@')[0] ||
            'User',
          email: authUser.email || '',
          role: 'customer',
          created_at: authUser.created_at,
        });
      }

      if (data.users.length < 1000) break;
    }

    // Profiles remain the source of truth for username and admin/customer role.
    const { data: profiles, error: profilesError } = await adminClient
      .from('gv_profiles')
      .select('id, username, role, created_at');

    if (profilesError) {
      console.error('Failed to load profiles:', profilesError.message);
      return json(res, 500, { error: 'Could not load user profiles.' });
    }

    const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
    const merged = users
      .map((authUser) => {
        const profile = profileMap.get(authUser.id);
        return {
          ...authUser,
          username: profile?.username || authUser.username,
          role: profile?.role || authUser.role,
          created_at: profile?.created_at || authUser.created_at,
        };
      })
      .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));

    return json(res, 200, { users: merged });
  }

  let body: { action?: string; userId?: string } = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    return json(res, 400, { error: 'Invalid request body.' });
  }

  if (body.action !== 'reset-password' || !body.userId) {
    return json(res, 400, { error: 'A valid password reset request is required.' });
  }

  const { data: target, error: targetError } = await adminClient.auth.admin.getUserById(body.userId);

  if (targetError || !target.user?.email) {
    return json(res, 404, { error: 'User email could not be found.' });
  }

  // Supabase sends the recovery email and does not expose the existing
  // password. The password itself is never readable by this API or admin UI.
  const redirectTo = `${getOrigin(req)}/update-password`;
  const { error: resetError } = await adminClient.auth.resetPasswordForEmail(target.user.email, {
    redirectTo,
  });

  if (resetError) {
    console.error('Password reset request failed:', resetError.message);
    return json(res, 500, { error: 'Could not send the password reset email.' });
  }

  return json(res, 200, { success: true });
}

function getOrigin(req: any) {
  const forwardedProto = req.headers?.['x-forwarded-proto'];
  const forwardedHost = req.headers?.['x-forwarded-host'];
  const host = forwardedHost || req.headers?.host;
  const protocol = forwardedProto || 'https';

  if (host) return `${protocol}://${host}`;
  return 'https://trusted.vercel.app';
}
