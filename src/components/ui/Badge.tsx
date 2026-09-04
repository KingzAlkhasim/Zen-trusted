import type { ReactNode } from 'react';
import type { Availability, InquiryStatus } from '@/types';

type Tone = 'brand' | 'success' | 'warning' | 'danger' | 'neutral' | 'info';

const tones: Record<Tone, string> = {
  brand: 'bg-brand-500/15 text-brand-300 border-brand-500/30',
  success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  danger: 'bg-red-500/15 text-red-300 border-red-500/30',
  neutral: 'bg-white/5 text-slate-300 border-white/10',
  info: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
};

export function Badge({
  tone = 'neutral',
  children,
  className = '',
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function AvailabilityBadge({
  availability,
}: {
  availability: Availability;
}) {
  if (availability === 'available')
    return (
      <Badge tone="success">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Available
      </Badge>
    );
  if (availability === 'reserved')
    return (
      <Badge tone="warning">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        Reserved
      </Badge>
    );
  return (
    <Badge tone="danger">
      <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
      Sold
    </Badge>
  );
}

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  const map: Record<InquiryStatus, { tone: Tone; label: string }> = {
    new: { tone: 'info', label: 'New' },
    contacted: { tone: 'brand', label: 'Contacted' },
    reserved: { tone: 'warning', label: 'Reserved' },
    completed: { tone: 'success', label: 'Completed' },
  };
  const { tone, label } = map[status];
  return <Badge tone={tone}>{label}</Badge>;
}
