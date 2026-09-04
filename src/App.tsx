import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from '@/store/StoreContext';
import { AuthProvider } from '@/store/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { HomePage } from '@/pages/public/HomePage';
import { MarketplacePage } from '@/pages/public/MarketplacePage';
import { AccountDetailsPage } from '@/pages/public/AccountDetailsPage';
import { AboutPage } from '@/pages/public/AboutPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { AdminOverviewPage } from '@/pages/admin/AdminOverviewPage';
import { AdminAccountsPage } from '@/pages/admin/AdminAccountsPage';
import { AdminAddAccountPage } from '@/pages/admin/AdminAddAccountPage';
import { AdminEditAccountPage } from '@/pages/admin/AdminEditAccountPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';

function NotFoundPage() {
  return (
    <div className="container-px flex flex-col items-center justify-center py-32 text-center">
      <h1 className="font-display text-5xl font-extrabold text-white">404</h1>
      <p className="mt-3 text-slate-400">The page you are looking for does not exist.</p>
      <a
        href="/"
        className="mt-6 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-ink-950 hover:bg-brand-400"
      >
        Back Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Public store */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/account/:id" element={<AccountDetailsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Route>

            {/* Admin dashboard (protected) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminOverviewPage />} />
              <Route path="accounts" element={<AdminAccountsPage />} />
              <Route path="add-account" element={<AdminAddAccountPage />} />
              <Route path="edit-account/:id" element={<AdminEditAccountPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="users" element={<AdminUsersPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </AuthProvider>
  );
}
