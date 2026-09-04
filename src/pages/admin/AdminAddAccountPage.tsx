import { AccountForm } from '@/components/AccountForm';

export function AdminAddAccountPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-white">Add New Account</h2>
        <p className="text-sm text-slate-400">
          Fill in the details below to list a new gaming account on the marketplace.
        </p>
      </div>
      <div className="card-surface p-6">
        <AccountForm />
      </div>
    </div>
  );
}
