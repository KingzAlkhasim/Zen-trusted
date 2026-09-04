import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ShieldCheck,
  MessageCircle,
  Clock,
  CreditCard,
  RefreshCw,
  Users,
} from 'lucide-react';
import { siteConfig, buildWhatsAppLink } from '@/config/site';
import { LinkButton } from '@/components/ui/Button';

const faqs = [
  {
    q: 'How do I buy an account?',
    a: 'Browse the marketplace, choose an account, and click "Buy on WhatsApp". You will be connected with our team to confirm availability and complete the purchase safely.',
  },
  {
    q: 'Are the accounts verified?',
    a: 'Yes. Every account is hand-checked and verified by our team before it is listed. We ensure the account matches the description, rank, and items shown.',
  },
  {
    q: 'How are payments handled?',
    a: 'For this MVP, all payments are handled personally through WhatsApp. No online payment gateway is used yet. This keeps transactions simple and secure.',
  },
  {
    q: 'How do I receive my account after purchase?',
    a: 'Once payment is confirmed, we transfer the account credentials to you directly via WhatsApp. There is no automatic delivery — everything is handled personally.',
  },
  {
    q: 'Can I get a refund?',
    a: 'Refund and replacement policies are discussed at the time of purchase. We recommend confirming all details with our team before completing the transaction.',
  },
  {
    q: 'Are account credentials shown publicly?',
    a: 'No. We never publicly expose any account credentials. Login details are only shared with the buyer after the purchase is confirmed.',
  },
  {
    q: 'What if an account is marked "Reserved"?',
    a: 'A reserved account is currently being negotiated with another buyer. You can still message us on WhatsApp to be notified if it becomes available again.',
  },
  {
    q: 'Do I need to create an account to buy?',
    a: 'No. The marketplace is open to browse without any login. You only need WhatsApp to contact us and complete a purchase.',
  },
];

export function AboutPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-grid-faint [background-size:40px_40px] opacity-30" />
        <div className="container-px relative py-16 text-center sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-300">
            <ShieldCheck className="h-3.5 w-3.5" /> Trusted Gaming Account Marketplace
          </span>
          <h1 className="mx-auto mt-6 max-w-2xl font-display text-3xl font-extrabold text-white sm:text-4xl">
            About {siteConfig.brandName}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            {siteConfig.brandShortDesc} We specialize in verified, high-tier gaming accounts
            across the most popular mobile and console titles.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="container-px py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Value icon={ShieldCheck} title="Verified" desc="Every account is hand-checked before listing." />
          <Value icon={Clock} title="Fast" desc="Quick, simple WhatsApp-based purchase flow." />
          <Value icon={CreditCard} title="No Hidden Fees" desc="The price you see is the price you pay." />
          <Value icon={Users} title="Personal Service" desc="One-on-one support before and after purchase." />
        </div>
      </section>

      {/* FAQ */}
      <section className="container-px py-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-2xl font-bold text-white sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-3">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="card-surface overflow-hidden"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-display text-sm font-bold text-white sm:text-base">
                    {f.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-brand-400 transition-transform ${
                      open === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {open === i && (
                  <div className="px-5 pb-4 text-sm leading-relaxed text-slate-400">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-px py-14">
        <div className="relative overflow-hidden rounded-3xl border border-brand-500/20 bg-gradient-to-r from-brand-950/60 to-ink-900/60 p-8 text-center lg:p-12">
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="relative">
            <RefreshCw className="mx-auto h-10 w-10 text-brand-400" />
            <h2 className="mt-4 font-display text-2xl font-bold text-white">Still have questions?</h2>
            <p className="mx-auto mt-2 max-w-md text-slate-400">
              Reach out to us directly on WhatsApp and we will be happy to help.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={buildWhatsAppLink(`Hello ${siteConfig.brandName}, I have a question.`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-ink-950 transition hover:bg-brand-400"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
              <LinkButton to="/marketplace" variant="outline">
                Browse Accounts
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Value({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof ShieldCheck;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-ink-900/50 p-6 text-center transition hover:border-brand-500/20">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/15">
        <Icon className="h-6 w-6 text-brand-400" />
      </div>
      <h3 className="mt-4 font-display text-base font-bold text-white">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-400">{desc}</p>
    </div>
  );
}
