import { Link } from 'react-router-dom';
import {
  Gamepad2,
  CheckCircle2,
  XCircle,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { gameBySlug } from '@/data/games';
import { formatPrice } from '@/config/site';
import { AvailabilityBadge, InquiryStatusBadge } from '@/components/ui/Badge';
import { SmartImage } from '@/components/ui/SmartImage';

export function AdminOverviewPage() {
  const { accounts, inquiries } = useStore();

  const total = accounts.length;
  const available = accounts.filter((a) => a.availability === 'available').length;
  const sold = accounts.filter((a) => a.availability === 'sold').length;
  const pending = inquiries.filter((i) => i.status === 'new').length;
  const revenue = accounts
    .filter((a) => a.availability === 'sold')
    .reduce((sum, a) => sum + a.price, 0);

  const stats = [
    { label: 'Total Accounts', value: total, icon: Gamepad2, tone: 'text-brand-400' },
    { label: 'Available', value: available, icon: CheckCircle2, tone: 'text-emerald-400' },
    { label: 'Sold', value: sold, icon: XCircle, tone: 'text-red-400' },
    { label: 'New Inquiries', value: pending, icon: MessageSquare, tone: 'text-sky-400' },
  ];

  const recent = accounts.slice(0, 5);
  const recentInquiries = inquiries.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card-surface p-5">
            <div className="flex items-center justify-between">
              <s.icon className={`h-5 w-5 ${s.tone}`} />
              <span className="font-display text-2xl font-extrabold text-white">{s.value}</span>
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Revenue banner */}
      <div className="relative overflow-hidden rounded-2xl border border-brand-500/20 bg-gradient-to-r from-brand-950/60 to-ink-900/60 p-6">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-400">
              <TrendingUp className="h-4 w-4 text-brand-400" />
              <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue (Sold)</span>
            </div>
            <p className="mt-2 font-display text-3xl font-extrabold text-white">{formatPrice(revenue)}</p>
          </div>
          <Link
            to="/admin/orders"
            className="hidden items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-brand-400 sm:inline-flex"
          >
            View Inquiries <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Recent listings */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">Recent Listings</h2>
          <Link
            to="/admin/add-account"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3.5 py-2 text-xs font-semibold text-ink-950 transition hover:bg-brand-400"
          >
            <Plus className="h-3.5 w-3.5" /> Add Account
          </Link>
        </div>
        <div className="card-surface overflow-hidden">
          <div className="divide-y divide-white/5">
            {recent.map((a) => {
              const game = gameBySlug(a.game);
              return (
                <Link
                  key={a.id}
                  to={`/admin/accounts`}
                  className="flex items-center gap-4 px-4 py-3 transition hover:bg-white/5"
                >
                  <SmartImage src={a.images[0]} alt="" className="h-12 w-16 flex-shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{a.title}</p>
                    <p className="text-xs text-slate-500">{game?.name} · {a.rank}</p>
                  </div>
                  <span className="hidden text-sm font-bold text-white sm:block">{formatPrice(a.price)}</span>
                  <AvailabilityBadge availability={a.availability} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent inquiries */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">Recent Inquiries</h2>
          <Link to="/admin/orders" className="text-sm font-semibold text-brand-300 hover:text-brand-200">
            View all →
          </Link>
        </div>
        <div className="card-surface overflow-hidden">
          <div className="divide-y divide-white/5">
            {recentInquiries.map((i) => (
              <div key={i.id} className="flex items-center gap-4 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{i.account_title}</p>
                  <p className="text-xs text-slate-500">{i.customer_name} · {i.customer_handle ?? 'N/A'}</p>
                </div>
                <span className="hidden text-sm font-bold text-white sm:block">{formatPrice(i.price)}</span>
                <InquiryStatusBadge status={i.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
