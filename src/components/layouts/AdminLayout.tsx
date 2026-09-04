import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Gamepad2,
  PlusCircle,
  MessageSquare,
  Users,
  Menu,
  X,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { siteConfig } from '@/config/site';
import { useAuth } from '@/store/AuthContext';

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/accounts', label: 'Accounts', icon: Gamepad2, end: false },
  { to: '/admin/add-account', label: 'Add Account', icon: PlusCircle, end: false },
  { to: '/admin/orders', label: 'Inquiries', icon: MessageSquare, end: false },
  { to: '/admin/users', label: 'Users', icon: Users, end: false },
];

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-ink-950 lg:flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-white/5 bg-ink-900 transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Logo />
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-300'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                }`
              }
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-3 pb-6">
          <button
            onClick={async () => {
              await signOut();
              navigate('/');
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Store
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-ink-950/80 px-4 backdrop-blur-xl lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg p-2 text-slate-300 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-display text-base font-bold text-white sm:text-lg">
              {pageTitle(location.pathname)}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:block">
              {profile?.username ?? 'Admin'}
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/20 text-sm font-bold text-brand-300">
              {(profile?.username ?? 'A').charAt(0).toUpperCase()}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function pageTitle(path: string): string {
  if (path === '/admin') return 'Dashboard Overview';
  if (path.startsWith('/admin/accounts')) return 'Accounts Management';
  if (path.startsWith('/admin/add-account')) return 'Add New Account';
  if (path.startsWith('/admin/edit-account')) return 'Edit Account';
  if (path.startsWith('/admin/orders')) return 'Inquiries & Orders';
  if (path.startsWith('/admin/users')) return 'Registered Users';
  return siteConfig.brandName + ' Admin';
}
