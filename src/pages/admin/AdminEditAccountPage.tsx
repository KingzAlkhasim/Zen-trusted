import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { AccountForm } from '@/components/AccountForm';

export function AdminEditAccountPage() {
  const { id } = useParams<{ id: string }>();
  const { getAccount } = useStore();
  const account = id ? getAccount(id) : undefined;

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="font-display text-xl font-bold text-white">Account not found</h2>
        <p className="mt-2 text-sm text-slate-400">This listing may have been deleted.</p>
        <Link
          to="/admin/accounts"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-ink-950 hover:bg-brand-400"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Accounts
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-white">Edit Account</h2>
        <p className="text-sm text-slate-400">Update the details for "{account.title}".</p>
      </div>
      <div className="card-surface p-6">
        <AccountForm existing={account} />
      </div>
    </div>
  );
}
