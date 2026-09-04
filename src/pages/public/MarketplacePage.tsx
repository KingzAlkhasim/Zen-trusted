import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { games } from '@/data/games';
import type { Availability } from '@/types';
import { AccountCard } from '@/components/AccountCard';

const PRICE_MAX = 100000;

export function MarketplacePage() {
  const { accounts } = useStore();
  const [params, setParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState<string>(params.get('game') || 'all');
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_MAX);
  const [availability, setAvailability] = useState<Availability | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return accounts.filter((a) => {
      if (search) {
        const q = search.toLowerCase();
        const match =
          a.title.toLowerCase().includes(q) ||
          games.find((g) => g.slug === a.game)?.name.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (gameFilter !== 'all' && a.game !== gameFilter) return false;
      if (a.price > maxPrice) return false;
      if (availability !== 'all' && a.availability !== availability) return false;
      return true;
    });
  }, [accounts, search, gameFilter, maxPrice, availability]);

  function selectGame(slug: string) {
    setGameFilter(slug);
    if (slug === 'all') params.delete('game');
    else params.set('game', slug);
    setParams(params, { replace: true });
  }

  function resetFilters() {
    setSearch('');
    setGameFilter('all');
    setMaxPrice(PRICE_MAX);
    setAvailability('all');
    params.delete('game');
    setParams(params, { replace: true });
  }

  const hasActiveFilters =
    search !== '' || gameFilter !== 'all' || maxPrice < PRICE_MAX || availability !== 'all';

  return (
    <div className="container-px py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">Marketplace</h1>
        <p className="mt-2 text-slate-400">
          Browse {accounts.length} verified gaming accounts across {games.length} popular titles.
        </p>
      </div>

      {/* Search + filter toggle */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or game..."
            className="input-base pl-10"
          />
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-ink-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-brand-500/40 lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filters sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="card-surface sticky top-20 space-y-6 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-300">
                Filters
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-xs text-brand-300 hover:text-brand-200"
                >
                  <X className="h-3 w-3" /> Reset
                </button>
              )}
            </div>

            {/* Game filter */}
            <div>
              <label className="label-base">Game</label>
              <div className="flex flex-col gap-1.5">
                <FilterChip active={gameFilter === 'all'} onClick={() => selectGame('all')}>
                  All Games
                </FilterChip>
                {games.map((g) => (
                  <FilterChip
                    key={g.slug}
                    active={gameFilter === g.slug}
                    onClick={() => selectGame(g.slug)}
                  >
                    {g.emoji} {g.name}
                  </FilterChip>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <label className="label-base">Max Price</label>
              <input
                type="range"
                min={10000}
                max={PRICE_MAX}
                step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-500"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>₦10k</span>
                <span className="font-semibold text-brand-300">₦{maxPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="label-base">Availability</label>
              <div className="flex flex-col gap-1.5">
                {(['all', 'available', 'reserved', 'sold'] as const).map((a) => (
                  <FilterChip
                    key={a}
                    active={availability === a}
                    onClick={() => setAvailability(a)}
                  >
                    {a === 'all' ? 'All' : a.charAt(0).toUpperCase() + a.slice(1)}
                  </FilterChip>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div>
          <p className="mb-4 text-sm text-slate-400">
            Showing <span className="font-semibold text-slate-200">{filtered.length}</span> result{filtered.length !== 1 && 's'}
          </p>
          {filtered.length === 0 ? (
            <div className="card-surface flex flex-col items-center justify-center py-20 text-center">
              <Search className="h-10 w-10 text-slate-600" />
              <h3 className="mt-4 font-display text-lg font-bold text-white">No accounts found</h3>
              <p className="mt-1 text-sm text-slate-400">Try adjusting your filters or search query.</p>
              <button
                onClick={resetFilters}
                className="mt-4 rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-ink-950 hover:bg-brand-400"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((a) => (
                <AccountCard key={a.id} account={a} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
        active
          ? 'bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30'
          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  );
}
