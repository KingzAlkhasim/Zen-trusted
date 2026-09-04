import { Link } from 'react-router-dom';
import { Eye, ShieldCheck } from 'lucide-react';
import type { AccountListing } from '@/types';
import { gameBySlug } from '@/data/games';
import { formatPrice } from '@/config/site';
import { AvailabilityBadge } from '@/components/ui/Badge';
import { SmartImage } from '@/components/ui/SmartImage';

export function AccountCard({ account }: { account: AccountListing }) {
  const game = gameBySlug(account.game);
  const sold = account.availability === 'sold';

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-ink-900/70 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-glow">
      <Link to={`/account/${account.id}`} className="relative block aspect-[16/10] overflow-hidden">
        <SmartImage
          src={account.images[0]}
          alt={account.title}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            sold ? 'opacity-50 grayscale' : ''
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className={`rounded-lg bg-gradient-to-r ${game?.accent} px-2.5 py-1 text-xs font-bold text-white shadow-md`}>
            {game?.emoji} {game?.shortName}
          </span>
        </div>
        <div className="absolute right-3 top-3">
          <AvailabilityBadge availability={account.availability} />
        </div>
        {account.featured && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1 rounded-md bg-accent-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-950">
              <ShieldCheck className="h-3 w-3" /> Featured
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 font-display text-base font-bold text-white">
          {account.title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <span className="text-slate-500">Rank:</span>
            <span className="font-semibold text-brand-300">{account.rank}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-slate-500">Lvl:</span>
            <span className="font-semibold text-slate-200">{account.level}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-slate-500">Skins:</span>
            <span className="font-semibold text-slate-200">{account.skins}</span>
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-500">Price</p>
            <p className="font-display text-xl font-extrabold text-white">
              {formatPrice(account.price)}
            </p>
          </div>
          <Link
            to={`/account/${account.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-ink-700 px-3.5 py-2 text-xs font-semibold text-slate-100 transition hover:bg-brand-500 hover:text-ink-950"
          >
            <Eye className="h-3.5 w-3.5" /> View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
