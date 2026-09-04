import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Pencil,
  Trash2,
  Plus,
  Eye,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { games, gameBySlug } from '@/data/games';
import { formatPrice } from '@/config/site';
import { AvailabilityBadge } from '@/components/ui/Badge';
import { SmartImage } from '@/components/ui/SmartImage';
import type { Availability } from '@/types';

export function AdminAccountsPage() {
  const { accounts, deleteAccount, setAvailability } = useStore();
  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return accounts.filter((a) => {
      if (search) {
        const q = search.toLowerCase();
        if (!a.title.toLowerCase().includes(q)) return false;
      }
      if (gameFilter !== 'all' && a.game !== gameFilter) return false;
      return true;
    });
  }, [accounts, search, gameFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-white">All Listings</h2>
          <p className="text-sm text-slate-400">{accounts.length} accounts total</p>
        </div>
        <Link
          to="/admin/add-account"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-brand-400"
        >
          <Plus className="h-4 w-4" /> Add New Account
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="input-base pl-10"
          />
        </div>
        <div className="relative">
          <select
            value={gameFilter}
            onChange={(e) => setGameFilter(e.target.value)}
            className="input-base appearance-none pr-10"
          >
            <option value="all">All Games</option>
            {games.map((g) => (
              <option key={g.slug} value={g.slug}>{g.name}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      {/* Table (desktop) */}
      <div className="card-surface hidden overflow-hidden lg:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3.5">Account</th>
              <th className="px-5 py-3.5">Game</th>
              <th className="px-5 py-3.5">Price</th>
              <th className="px-5 py-3.5">Rank</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((a) => {
              const game = gameBySlug(a.game);
              return (
                <tr key={a.id} className="transition hover:bg-white/5">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <SmartImage src={a.images[0]} alt="" className="h-10 w-14 rounded-lg object-cover" />
                      <span className="max-w-[200px] truncate text-sm font-semibold text-white">{a.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-300">{game?.shortName}</td>
                  <td className="px-5 py-3 text-sm font-bold text-white">{formatPrice(a.price)}</td>
                  <td className="px-5 py-3 text-sm text-slate-300">{a.rank}</td>
                  <td className="px-5 py-3">
                    <AvailabilityBadge availability={a.availability} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <StatusMenu
                        current={a.availability}
                        onChange={(v) => setAvailability(a.id, v)}
                      />
                      <Link
                        to={`/account/${a.id}`}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-brand-300"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/admin/edit-account/${a.id}`}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-brand-300"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(a.id)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-500">No accounts match your search.</p>
        )}
      </div>

      {/* Cards (mobile) */}
      <div className="space-y-3 lg:hidden">
        {filtered.map((a) => {
          const game = gameBySlug(a.game);
          return (
            <div key={a.id} className="card-surface p-4">
              <div className="flex items-start gap-3">
                <SmartImage src={a.images[0]} alt="" className="h-14 w-20 flex-shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{a.title}</p>
                  <p className="text-xs text-slate-500">{game?.name} · {a.rank}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{formatPrice(a.price)}</span>
                    <AvailabilityBadge availability={a.availability} />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <StatusMenu current={a.availability} onChange={(v) => setAvailability(a.id, v)} />
                <Link
                  to={`/admin/edit-account/${a.id}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-ink-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-ink-600"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Link>
                <button
                  onClick={() => setConfirmDelete(a.id)}
                  className="rounded-lg bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-500">No accounts match your search.</p>
        )}
      </div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-ink-900 p-6">
            <Trash2 className="h-8 w-8 text-red-400" />
            <h3 className="mt-3 font-display text-lg font-bold text-white">Delete this account?</h3>
            <p className="mt-1 text-sm text-slate-400">
              This action cannot be undone. The listing will be permanently removed.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteAccount(confirmDelete);
                  setConfirmDelete(null);
                }}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusMenu({
  current,
  onChange,
}: {
  current: Availability;
  onChange: (v: Availability) => void;
}) {
  const [open, setOpen] = useState(false);
  const options: Availability[] = ['available', 'reserved', 'sold'];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-ink-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-brand-500/40"
      >
        <span className={`h-1.5 w-1.5 rounded-full ${
          current === 'available' ? 'bg-emerald-400' : current === 'reserved' ? 'bg-amber-400' : 'bg-red-400'
        }`} />
        {current}
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-lg border border-white/10 bg-ink-800 py-1 shadow-xl">
            {options.map((o) => (
              <button
                key={o}
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium transition hover:bg-white/5 ${
                  o === current ? 'text-brand-300' : 'text-slate-300'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${
                  o === 'available' ? 'bg-emerald-400' : o === 'reserved' ? 'bg-amber-400' : 'bg-red-400'
                }`} />
                {o.charAt(0).toUpperCase() + o.slice(1)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
