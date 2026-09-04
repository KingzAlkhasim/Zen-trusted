import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  AccountListing,
  Availability,
  Inquiry,
  InquiryStatus,
} from '@/types';
import { supabase } from '@/lib/supabase';

type AccountInsert = Omit<AccountListing, 'id' | 'created_at'>;

interface StoreContextValue {
  accounts: AccountListing[];
  inquiries: Inquiry[];
  loading: boolean;
  getAccount: (id: string) => AccountListing | undefined;
  addAccount: (data: AccountInsert) => Promise<void>;
  updateAccount: (id: string, data: Partial<AccountInsert>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  setAvailability: (id: string, availability: Availability) => Promise<void>;
  updateInquiryStatus: (id: string, status: InquiryStatus) => Promise<void>;
  createInquiry: (data: {
    account_id: string | null;
    account_title: string;
    customer_name: string;
    customer_handle?: string;
    price: number;
    message: string;
  }) => Promise<void>;
  refreshAccounts: () => Promise<void>;
  refreshInquiries: () => Promise<void>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<AccountListing[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshAccounts = useCallback(async () => {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Failed to load accounts:', error.message);
      return;
    }
    setAccounts((data ?? []) as AccountListing[]);
  }, []);

  const refreshInquiries = useCallback(async () => {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Failed to load inquiries:', error.message);
      return;
    }
    setInquiries((data ?? []) as Inquiry[]);
  }, []);

  useEffect(() => {
    (async () => {
      await Promise.all([refreshAccounts(), refreshInquiries()]);
      setLoading(false);
    })();
  }, [refreshAccounts, refreshInquiries]);

  const getAccount = useCallback(
    (id: string) => accounts.find((a) => a.id === id),
    [accounts],
  );

  const addAccount = useCallback(
    async (data: AccountInsert) => {
      const { error } = await supabase.from('accounts').insert(data);
      if (error) throw error;
      await refreshAccounts();
    },
    [refreshAccounts],
  );

  const updateAccount = useCallback(
    async (id: string, data: Partial<AccountInsert>) => {
      const { error } = await supabase.from('accounts').update(data).eq('id', id);
      if (error) throw error;
      await refreshAccounts();
    },
    [refreshAccounts],
  );

  const deleteAccount = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('accounts').delete().eq('id', id);
      if (error) throw error;
      await refreshAccounts();
    },
    [refreshAccounts],
  );

  const setAvailability = useCallback(
    async (id: string, availability: Availability) => {
      const { error } = await supabase
        .from('accounts')
        .update({ availability })
        .eq('id', id);
      if (error) throw error;
      await refreshAccounts();
    },
    [refreshAccounts],
  );

  const updateInquiryStatus = useCallback(
    async (id: string, status: InquiryStatus) => {
      const { error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      await refreshInquiries();
    },
    [refreshInquiries],
  );

  const createInquiry = useCallback(
    async (data: {
      account_id: string | null;
      account_title: string;
      customer_name: string;
      customer_handle?: string;
      price: number;
      message: string;
    }) => {
      const { error } = await supabase.from('inquiries').insert(data);
      if (error) throw error;
      await refreshInquiries();
    },
    [refreshInquiries],
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      accounts,
      inquiries,
      loading,
      getAccount,
      addAccount,
      updateAccount,
      deleteAccount,
      setAvailability,
      updateInquiryStatus,
      createInquiry,
      refreshAccounts,
      refreshInquiries,
    }),
    [
      accounts,
      inquiries,
      loading,
      getAccount,
      addAccount,
      updateAccount,
      deleteAccount,
      setAvailability,
      updateInquiryStatus,
      createInquiry,
      refreshAccounts,
      refreshInquiries,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}
