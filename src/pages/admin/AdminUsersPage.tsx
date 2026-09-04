import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  ShieldCheck,
  Crown,
  Calendar,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ProfileRow {
  id: string;
  username: string;
  role: string;
  created_at: string;
}

export function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('gv_profiles')
        .select('id, username, role, created_at')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Failed to load users:', error.message);
      } else {
        setUsers((data ?? []) as ProfileRow[]);
      }
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter((u) => u.username.toLowerCase().includes(q));
  }, [search, users]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-white">Registered Users</h2>
        <p className="text-sm text-slate-400">
          {loading ? 'Loading...' : `${users.length} registered users`}
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username..."
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
            {users.length === 0
              ? 'No users have signed up yet.'
              : 'No users match your search.'}
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
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((u) => (
                  <tr key={u.id} className="transition hover:bg-white/5">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/15 text-sm font-bold text-brand-300">
                          {u.username.charAt(0).toUpperCase()}
                        </span>
                        <span className="text-sm font-semibold text-white">{u.username}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-400">
                      {new Date(u.created_at).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
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
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/15 text-sm font-bold text-brand-300">
                    {u.username.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">{u.username}</p>
                    <p className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(u.created_at).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <RoleBadge role={u.role} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
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
