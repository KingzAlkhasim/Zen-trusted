import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  Trophy,
  Swords,
  MapPin,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { useAuth } from '@/store/AuthContext';
import { gameBySlug } from '@/data/games';
import { formatPrice, buildWhatsAppLink } from '@/config/site';
import { AvailabilityBadge } from '@/components/ui/Badge';
import { AccountCard } from '@/components/AccountCard';
import { SmartImage } from '@/components/ui/SmartImage';

export function AccountDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { getAccount, accounts, createInquiry, loading } = useStore();
  const { user, profile } = useAuth();
  const account = id ? getAccount(id) : undefined;
  const [activeImg, setActiveImg] = useState(0);

  if (!account) {
    return (
      <div className="container-px flex flex-col items-center justify-center py-32 text-center">
        <h1 className="font-display text-2xl font-bold text-white">Account not found</h1>
        <p className="mt-2 text-slate-400">This listing may have been removed or sold.</p>
        <Link
          to="/marketplace"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-ink-950 hover:bg-brand-400"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Marketplace
        </Link>
      </div>
    );
  }

  const game = gameBySlug(account.game);
  const related = accounts
    .filter((a) => a.game === account.game && a.id !== account.id && a.availability !== 'sold')
    .slice(0, 3);

  const waMessage = `Hello, I am interested in buying ${account.title} for ${formatPrice(account.price)}. Is it still available?`;

  const handleBuyClick = () => {
    if (account!.availability === 'sold') return;
    createInquiry({
      account_id: account!.id,
      account_title: account!.title,
      customer_name: profile?.username ?? user?.email ?? 'Guest',
      customer_handle: '',
      price: account!.price,
      message: waMessage,
    }).catch(() => {});
  };

  return (
    <div className="container-px py-8 lg:py-12">
      <Link
        to="/marketplace"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-brand-300"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Marketplace
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/5 bg-ink-900">
            <SmartImage
              src={account.images[activeImg]}
              alt={account.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute left-3 top-3 flex gap-2">
              <span className={`rounded-lg bg-gradient-to-r ${game?.accent} px-2.5 py-1 text-xs font-bold text-white shadow-md`}>
                {game?.emoji} {game?.name}
              </span>
            </div>
            <div className="absolute right-3 top-3">
              <AvailabilityBadge availability={account.availability} />
            </div>
            {account.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImg((i) => (i === 0 ? account.images.length - 1 : i - 1))
                  }
                  className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink-950/70 text-white backdrop-blur transition hover:bg-ink-950"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() =>
                    setActiveImg((i) => (i === account.images.length - 1 ? 0 : i + 1))
                  }
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink-950/70 text-white backdrop-blur transition hover:bg-ink-950"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
          {account.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {account.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-16 w-24 overflow-hidden rounded-lg border-2 transition ${
                    activeImg === i ? 'border-brand-500' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <SmartImage src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-brand-300">{game?.name}</span>
            {account.featured && (
              <span className="inline-flex items-center gap-1 rounded-md bg-accent-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-950">
                <Star className="h-3 w-3" /> Featured
              </span>
            )}
          </div>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-white sm:text-3xl">
            {account.title}
          </h1>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-xs uppercase tracking-wider text-slate-500">Price</span>
            <span className="font-display text-3xl font-extrabold text-white">
              {formatPrice(account.price)}
            </span>
          </div>

          {/* Stats grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={Trophy} label="Rank" value={account.rank} />
            <Stat icon={Swords} label="Level" value={String(account.level)} />
            <Stat icon={Star} label="Skins" value={String(account.skins)} />
            <Stat icon={MapPin} label="Region" value={account.region} />
          </div>

          {/* Buy button */}
          <div className="mt-6">
            <a
              href={account.availability === 'sold' ? undefined : buildWhatsAppLink(waMessage)}
              target="_blank"
              rel="noreferrer"
              onClick={handleBuyClick}
              className={`flex w-full items-center justify-center gap-2.5 rounded-2xl px-6 py-4 text-base font-bold transition ${
                account.availability === 'sold'
                  ? 'cursor-not-allowed bg-ink-700 text-slate-500'
                  : 'bg-brand-500 text-ink-950 shadow-glow hover:bg-brand-400'
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              {account.availability === 'sold' ? 'Sold Out' : 'Buy on WhatsApp'}
            </a>
            <p className="mt-2 text-center text-xs text-slate-500">
              You will be redirected to WhatsApp with a pre-filled message.
            </p>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h3 className="font-display text-lg font-bold text-white">Description</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {account.description}
            </p>
          </div>

          {/* Features */}
          <div className="mt-6">
            <h3 className="font-display text-lg font-bold text-white">Key Features</h3>
            <ul className="mt-3 space-y-2">
              {account.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Safety note */}
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-brand-500/20 bg-brand-500/5 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-400" />
            <p className="text-xs text-slate-300">
              Account credentials are only shared after purchase is confirmed. We never publicly
              expose login details. All transactions are handled personally via WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold text-white">Related Accounts</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <AccountCard key={a.id} account={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Trophy;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-ink-800/50 p-3.5">
      <Icon className="h-4 w-4 text-brand-400" />
      <p className="mt-2 text-[11px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="font-display text-sm font-bold text-white">{value}</p>
    </div>
  );
}
