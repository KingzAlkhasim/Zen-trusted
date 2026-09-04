import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Search,
  ShieldCheck,
  Headphones,
  Zap,
  CheckCircle2,
  MessageCircle,
  Gamepad2,
} from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { games } from '@/data/games';
import { siteConfig } from '@/config/site';
import { AccountCard } from '@/components/AccountCard';
import { LinkButton } from '@/components/ui/Button';

export function HomePage() {
  const { accounts } = useStore();
  const featured = accounts.filter((a) => a.featured && a.availability !== 'sold').slice(0, 6);
  const availableCount = accounts.filter((a) => a.availability === 'available').length;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-faint [background-size:40px_40px] opacity-40" />
        <div className="absolute -top-40 left-1/2 h-96 w-[120%] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="container-px relative py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-300">
              <ShieldCheck className="h-3.5 w-3.5" /> Verified & hand-checked accounts
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find Your Next <span className="gradient-text">Gaming Account</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-slate-400 sm:text-lg">
              {siteConfig.brandName} is a premium marketplace for high-tier gaming accounts.
              Browse verified listings, pick your perfect account, and complete your purchase
              safely through WhatsApp.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LinkButton to="/marketplace" size="lg" className="w-full sm:w-auto">
                Browse Accounts <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton to="/marketplace" variant="outline" size="lg" className="w-full sm:w-auto">
                <Gamepad2 className="h-4 w-4" /> View Available Games
              </LinkButton>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-brand-400" /> {availableCount}+ accounts available
              </span>
              <span className="hidden h-4 w-px bg-white/10 sm:block" />
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-brand-400" /> 5 popular games
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular games */}
      <section className="container-px py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Popular Games</h2>
            <p className="mt-1 text-sm text-slate-400">Browse accounts by your favourite title</p>
          </div>
          <Link to="/marketplace" className="hidden text-sm font-semibold text-brand-300 hover:text-brand-200 sm:block">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {games.map((g) => (
            <Link
              key={g.slug}
              to={`/marketplace?game=${g.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-white/5 p-5 transition hover:-translate-y-1 hover:border-brand-500/30"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${g.accent} opacity-20 transition group-hover:opacity-40`} />
              <div className="relative">
                <span className="text-3xl">{g.emoji}</span>
                <h3 className="mt-3 font-display text-sm font-bold text-white">{g.name}</h3>
                <p className="mt-1 text-xs text-slate-400">
                  {accounts.filter((a) => a.game === g.slug && a.availability !== 'sold').length} available
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured accounts */}
      <section className="container-px py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Featured Accounts</h2>
            <p className="mt-1 text-sm text-slate-400">Hand-picked premium listings</p>
          </div>
          <Link to="/marketplace" className="text-sm font-semibold text-brand-300 hover:text-brand-200">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((a) => (
            <AccountCard key={a.id} account={a} />
          ))}
        </div>
      </section>

      {/* Why buy from us */}
      <section className="container-px py-12">
        <div className="rounded-3xl border border-white/5 bg-ink-900/50 p-8 lg:p-12">
          <h2 className="text-center font-display text-2xl font-bold text-white sm:text-3xl">
            Why Buy From {siteConfig.brandName}?
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <Feature
              icon={ShieldCheck}
              title="Verified Accounts"
              desc="Every account is hand-checked and verified before listing. No scams, no surprises."
            />
            <Feature
              icon={Zap}
              title="Fast & Simple"
              desc="Browse, choose, and contact the seller on WhatsApp. No complicated checkout process."
            />
            <Feature
              icon={Headphones}
              title="Dedicated Support"
              desc="We are one message away. Get help before and after your purchase via WhatsApp."
            />
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="container-px py-12">
        <h2 className="text-center font-display text-2xl font-bold text-white sm:text-3xl">
          How It Works
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          <Step n={1} icon={Search} title="Browse" desc="Explore verified gaming accounts in our marketplace." />
          <Step n={2} icon={Gamepad2} title="Choose Account" desc="Pick the account that matches your needs and budget." />
          <Step n={3} icon={MessageCircle} title="Contact Seller" desc="Click 'Buy on WhatsApp' to message us directly." />
          <Step n={4} icon={CheckCircle2} title="Complete Purchase" desc="Finalize details and receive your account safely." />
        </div>
      </section>

      {/* Trust / safety */}
      <section className="container-px py-12">
        <div className="relative overflow-hidden rounded-3xl border border-brand-500/20 bg-gradient-to-r from-brand-950/60 to-ink-900/60 p-8 lg:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="relative max-w-2xl">
            <ShieldCheck className="h-10 w-10 text-brand-400" />
            <h2 className="mt-4 font-display text-2xl font-bold text-white">Trust & Safety</h2>
            <p className="mt-3 text-slate-300">
              Your security is our priority. We never publicly expose account credentials, and all
              transactions are handled personally through WhatsApp to ensure a safe, transparent
              buying experience. Every listing is verified by our team before it goes live.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton to="/about" variant="outline">
                Read Our FAQ
              </LinkButton>
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-brand-400"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof ShieldCheck;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-ink-800/50 p-6 transition hover:border-brand-500/20">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/15">
        <Icon className="h-6 w-6 text-brand-400" />
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{desc}</p>
    </div>
  );
}

function Step({
  n,
  icon: Icon,
  title,
  desc,
}: {
  n: number;
  icon: typeof Search;
  title: string;
  desc: string;
}) {
  return (
    <div className="relative rounded-2xl border border-white/5 bg-ink-900/50 p-6">
      <span className="absolute right-4 top-4 font-display text-4xl font-extrabold text-white/5">
        {n}
      </span>
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15">
        <Icon className="h-5 w-5 text-brand-400" />
      </div>
      <h3 className="mt-4 font-display text-base font-bold text-white">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-400">{desc}</p>
    </div>
  );
}
