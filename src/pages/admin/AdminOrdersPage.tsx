import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MessageCircle, ChevronDown } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { formatPrice } from '@/config/site';
import { InquiryStatusBadge } from '@/components/ui/Badge';
import type { InquiryStatus } from '@/types';

const statuses: InquiryStatus[] = ['new', 'contacted', 'reserved', 'completed'];

export function AdminOrdersPage() {
  const { inquiries, updateInquiryStatus } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'all'>('all');

  const filtered = useMemo(() => {
    return inquiries.filter((i) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !i.account_title.toLowerCase().includes(q) &&
          !i.customer_name.toLowerCase().includes(q)
        )
          return false;
      }
      if (statusFilter !== 'all' && i.status !== statusFilter) return false;
      return true;
    });
  }, [inquiries, search, statusFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: inquiries.length };
    for (const s of statuses) c[s] = inquiries.filter((i) => i.status === s).length;
    return c;
  }, [inquiries]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-white">Inquiries & Orders</h2>
        <p className="text-sm text-slate-400">
          All purchase inquiries received via WhatsApp. Update statuses as you progress.
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        <TabButton active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
          All <span className="opacity-60">({counts.all})</span>
        </TabButton>
        {statuses.map((s) => (
          <TabButton
            key={s}
            active={statusFilter === s}
            onClick={() => setStatusFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)} <span className="opacity-60">({counts[s]})</span>
          </TabButton>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by account or customer..."
          className="input-base pl-10"
        />
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((i) => (
          <div key={i.id} className="card-surface p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={i.account_id ? `/account/${i.account_id}` : '/admin/orders'}
                    className="truncate font-display text-sm font-bold text-white hover:text-brand-300"
                  >
                    {i.account_title}
                  </Link>
                  <InquiryStatusBadge status={i.status} />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {i.customer_name} · {i.customer_handle ?? 'N/A'}
                </p>
                <p className="mt-2 rounded-lg border border-white/5 bg-ink-800/50 px-3 py-2 text-xs text-slate-400">
                  "{i.message ?? ''}"
                </p>
                <p className="mt-2 text-[11px] text-slate-600">
                  {new Date(i.created_at).toLocaleDateString('en-NG', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 sm:w-40">
                <span className="font-display text-lg font-bold text-white">
                  {formatPrice(i.price)}
                </span>
                <StatusSelect
                  current={i.status}
                  onChange={(v) => updateInquiryStatus(i.id, v)}
                />
                <a
                  href={`https://wa.me/${(i.customer_handle ?? '').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-ink-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-brand-500 hover:text-ink-950"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Reply
                </a>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-500">No inquiries found.</p>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
        active
          ? 'bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30'
          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  );
}

function StatusSelect({
  current,
  onChange,
}: {
  current: InquiryStatus;
  onChange: (v: InquiryStatus) => void;
}) {
  return (
    <div className="relative w-full">
      <select
        value={current}
        onChange={(e) => onChange(e.target.value as InquiryStatus)}
        className="input-base appearance-none py-2 text-xs pr-8"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
    </div>
  );
}
