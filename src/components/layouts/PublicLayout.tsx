import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, X, MessageCircle, ShoppingBag, Info, Home, LogOut, LayoutDashboard } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { siteConfig } from '@/config/site';
import { useAuth } from '@/store/AuthContext';

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/about', label: 'About / FAQ', icon: Info },
];

export function PublicLayout() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut, profile } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-ink-950">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/80 backdrop-blur-xl">
        <div className="container-px flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'text-brand-300'
                      : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-brand-500/40 hover:text-brand-300"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                )}
                <span className="text-xs text-slate-400">Hi, {profile?.username ?? 'there'}</span>
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 transition hover:text-white"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg border border-white/10 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-brand-500/40 hover:text-brand-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  Sign Up
                </Link>
              </>
            )}
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-ink-950 transition hover:bg-brand-400"
            >
              <MessageCircle className="h-4 w-4" /> Contact
            </a>
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-slate-200 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-white/5 bg-ink-950 md:hidden">
            <nav className="container-px flex flex-col gap-1 py-4">
              {navLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-brand-500/10 text-brand-300'
                        : 'text-slate-300 hover:bg-white/5'
                    }`
                  }
                >
                  <l.icon className="h-4 w-4" /> {l.label}
                </NavLink>
              ))}
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/5"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/5"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/5"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/5"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer user={!!user} isAdmin={isAdmin} />
    </div>
  );
}

function Footer({ user, isAdmin }: { user: boolean; isAdmin: boolean }) {
  return (
    <footer className="border-t border-white/5 bg-ink-900/50">
      <div className="container-px py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-slate-400">
              {siteConfig.brandShortDesc}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <SocialLink href={`https://wa.me/${siteConfig.whatsappNumber}`} label="WhatsApp" icon={MessageCircle} />
              <SocialLink href={siteConfig.instagram} label="Instagram" icon={MessageCircle} />
              <SocialLink href={siteConfig.twitter} label="Twitter" icon={MessageCircle} />
              <SocialLink href={siteConfig.discord} label="Discord" icon={MessageCircle} />
              <SocialLink href={siteConfig.telegram} label="Telegram" icon={MessageCircle} />
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/marketplace" className="text-slate-400 hover:text-brand-300">Marketplace</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-brand-300">About / FAQ</Link></li>
              <li><Link to={user ? (isAdmin ? '/admin' : '/') : '/login'} className="text-slate-400 hover:text-brand-300">{user ? (isAdmin ? 'Admin Dashboard' : 'My Account') : 'Sign In'}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>WhatsApp: +{siteConfig.whatsappNumber}</li>
              <li>Email: {siteConfig.email}</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.</p>
          <p>Built as a demo MVP. No real transactions are processed.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof MessageCircle;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-brand-500/40 hover:text-brand-300"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}
