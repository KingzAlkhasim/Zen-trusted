import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  ShieldCheck,
  Crown,
  Calendar,
  Mail,
  KeyRound,
  Loader2,
  CheckCircle2,
  LockKeyhole,
} from 'lucide-react';
import { useAuth } from '@/store/AuthContext';

interface ProfileRow {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export function AdminUsersPage() {
  const { session } = useAuth();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [resetSentId, setResetSentId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const body = await response.json();

        if (!response.ok) {
          throw new Error(body.error || 'Failed to load users.');
        }

        if (!cancelled) setUsers(body.users ?? []);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load users.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadUsers();
    return () => {
      cancelled = true;
    };
  }, [session?.access_token]);

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [search, users]);

  async function sendPasswordReset(user: ProfileRow) {
    if (!session?.access_token || resettingId) return;

    setResettingId(user.id);
    setResetSentId(null);
    setError('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reset-password', userId: user.id }),
      });
      const body = await response.json();

      if (!response.ok) throw new Error(body.error || 'Could not send reset email.');
      setResetSentId(user.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send reset email.');
    } finally {
      setResettingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-white">Registered Users</h2>
        <p className="text-sm text-slate-400">
          {loading ? 'Loading...' : `${users.length} registered users`}
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username or email..."
          className="input-base pl-10"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-surface py-16 text-center">
          <p className="text-sm text-slate-500">
            {users.length === 0 ? 'No users have signed up yet.' : 'No users match your search.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="card-surface hidden overflow-hidden lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3.5">Username</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Password</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((u) => (
                  <tr key={u.id} className="transition hover:bg-white/5">
                    <td className="px-5 py-3.5">
                      <UserIdentity username={u.username} />
                    </td>
                    <td className="px-5 py-3.5">
                      <EmailValue email={u.email} />
                    </td>
                    <td className="px-5 py-3.5">
                      <PasswordValue />
                      <ResetButton
                        user={u}
                        resetting={resettingId === u.id}
                        sent={resetSentId === u.id}
                        onReset={sendPasswordReset}
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-400">
                      {formatDate(u.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {filtered.map((u) => (
              <div key={u.id} className="card-surface p-4">
                <div className="flex items-start gap-3">
                  <UserAvatar username={u.username} />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-bold text-white">{u.username}</p>
                      <RoleBadge role={u.role} />
                    </div>
                    <EmailValue email={u.email} />
                    <PasswordValue />
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(u.created_at)}
                      </p>
                      <ResetButton
                        user={u}
                        resetting={resettingId === u.id}
                        sent={resetSentId === u.id}
                        onReset={sendPasswordReset}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function UserAvatar({ username }: { username: string }) {
  return (
    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-sm font-bold text-brand-300">
      {username.charAt(0).toUpperCase()}
    </span>
  );
}

function UserIdentity({ username }: { username: string }) {
  return (
    <div className="flex items-center gap-3">
      <UserAvatar username={username} />
      <span className="text-sm font-semibold text-white">{username}</span>
    </div>
  );
}

function EmailValue({ email }: { email: string }) {
  return (
    <span className="inline-flex max-w-[240px] items-center gap-1.5 truncate text-sm text-slate-300" title={email}>
      <Mail className="h-3.5 w-3.5 flex-shrink-0 text-slate-500" />
      <span className="truncate">{email}</span>
    </span>
  );
}

function PasswordValue() {
  return (
    <span
      className="mb-2 inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-xs font-medium text-slate-400"
      title="Passwords are securely hashed and cannot be viewed. Use Reset password to send a recovery email."
    >
      <LockKeyhole className="h-3.5 w-3.5" />
      •••••••• <span className="text-slate-500">(hidden)</span>
    </span>
  );
}

function ResetButton({
  user,
  resetting,
  sent,
  onReset,
}: {
  user: ProfileRow;
  resetting: boolean;
  sent: boolean;
  onReset: (user: ProfileRow) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onReset(user)}
      disabled={resetting}
      title="Send a secure password reset email"
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-brand-500/30 hover:bg-brand-500/10 hover:text-brand-200 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {resetting ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : sent ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <KeyRound className="h-3.5 w-3.5" />
      )}
      {resetting ? 'Sending...' : sent ? 'Email sent' : 'Reset password'}
    </button>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function RoleBadge({ role }: { role: string }) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
        <Crown className="h-3 w-3" /> Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
      <ShieldCheck className="h-3 w-3" /> Customer
    </span>
  );
}
