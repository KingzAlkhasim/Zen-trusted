import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { SmartImage } from '@/components/ui/SmartImage';
import { games } from '@/data/games';
import type { AccountListing, Availability, GameSlug } from '@/types';

export interface AccountFormValues {
  title: string;
  game: GameSlug;
  price: number;
  rank: string;
  level: number;
  skins: number;
  region: string;
  description: string;
  features: string[];
  images: string[];
  availability: Availability;
  featured: boolean;
}

const defaultValues: AccountFormValues = {
  title: '',
  game: 'free-fire',
  price: 25000,
  rank: '',
  level: 50,
  skins: 10,
  region: 'Asia',
  description: '',
  features: [],
  images: [],
  availability: 'available',
  featured: false,
};

const sampleImages = [
  'https://images.pexels.com/photos/9072216/pexels-photo-9072216.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/7862508/pexels-photo-7862508.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/16311112/pexels-photo-16311112.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/31971487/pexels-photo-31971487.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

export function AccountForm({ existing }: { existing?: AccountListing }) {
  const { addAccount, updateAccount } = useStore();
  const navigate = useNavigate();
  const [values, setValues] = useState<AccountFormValues>(
    existing
      ? {
          title: existing.title,
          game: existing.game as GameSlug,
          price: existing.price,
          rank: existing.rank,
          level: existing.level,
          skins: existing.skins,
          region: existing.region,
          description: existing.description,
          features: existing.features,
          images: existing.images,
          availability: existing.availability,
          featured: existing.featured,
        }
      : defaultValues,
  );
  const [imageUrl, setImageUrl] = useState('');
  const [featureText, setFeatureText] = useState('');
  const [error, setError] = useState('');

  function set<K extends keyof AccountFormValues>(key: K, val: AccountFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function addImage() {
    const url = imageUrl.trim();
    if (!url) return;
    set('images', [...values.images, url]);
    setImageUrl('');
  }
  function removeImage(i: number) {
    set('images', values.images.filter((_, idx) => idx !== i));
  }
  function addFeature() {
    const f = featureText.trim();
    if (!f) return;
    set('features', [...values.features, f]);
    setFeatureText('');
  }
  function removeFeature(i: number) {
    set('features', values.features.filter((_, idx) => idx !== i));
  }

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.title.trim()) return setError('Account title is required.');
    if (!values.rank.trim()) return setError('Rank is required.');
    if (!values.description.trim()) return setError('Description is required.');
    if (values.images.length === 0) return setError('Add at least one image URL.');

    const payload = {
      ...values,
      price: Number(values.price),
      level: Number(values.level),
      skins: Number(values.skins),
    };

    setSubmitting(true);
    try {
      if (existing) {
        await updateAccount(existing.id, payload);
      } else {
        await addAccount(payload);
      }
      navigate('/admin/accounts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save account.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label-base">Account Title *</label>
          <input
            className="input-base"
            value={values.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Heroic Bundle — Full Rare Collection"
          />
        </div>
        <div>
          <label className="label-base">Game *</label>
          <select
            className="input-base"
            value={values.game}
            onChange={(e) => set('game', e.target.value as GameSlug)}
          >
            {games.map((g) => (
              <option key={g.slug} value={g.slug}>{g.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <div>
          <label className="label-base">Price (₦) *</label>
          <input
            type="number"
            className="input-base"
            value={values.price}
            onChange={(e) => set('price', Number(e.target.value))}
            min={0}
            step={1000}
          />
        </div>
        <div>
          <label className="label-base">Rank *</label>
          <input
            className="input-base"
            value={values.rank}
            onChange={(e) => set('rank', e.target.value)}
            placeholder="e.g. Heroic"
          />
        </div>
        <div>
          <label className="label-base">Level</label>
          <input
            type="number"
            className="input-base"
            value={values.level}
            onChange={(e) => set('level', Number(e.target.value))}
            min={1}
          />
        </div>
        <div>
          <label className="label-base">Skins / Items</label>
          <input
            type="number"
            className="input-base"
            value={values.skins}
            onChange={(e) => set('skins', Number(e.target.value))}
            min={0}
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="label-base">Region</label>
          <input
            className="input-base"
            value={values.region}
            onChange={(e) => set('region', e.target.value)}
            placeholder="e.g. Asia"
          />
        </div>
        <div>
          <label className="label-base">Availability</label>
          <select
            className="input-base"
            value={values.availability}
            onChange={(e) => set('availability', e.target.value as Availability)}
          >
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </div>
        <div>
          <label className="label-base">Featured</label>
          <select
            className="input-base"
            value={values.featured ? 'yes' : 'no'}
            onChange={(e) => set('featured', e.target.value === 'yes')}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label-base">Description *</label>
        <textarea
          className="input-base min-h-[100px] resize-y"
          value={values.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Describe the account, its history, and what makes it valuable..."
        />
      </div>

      {/* Features */}
      <div>
        <label className="label-base">Key Features</label>
        <div className="flex gap-2">
          <input
            className="input-base"
            value={featureText}
            onChange={(e) => setFeatureText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addFeature();
              }
            }}
            placeholder="Add a feature and press Enter"
          />
          <button
            type="button"
            onClick={addFeature}
            className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-ink-700 px-4 text-sm font-semibold text-slate-200 transition hover:bg-ink-600"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
        {values.features.length > 0 && (
          <ul className="mt-3 space-y-2">
            {values.features.map((f, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-ink-800/50 px-3 py-2 text-sm text-slate-200"
              >
                {f}
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  className="text-slate-500 transition hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Images */}
      <div>
        <label className="label-base">Image URLs</label>
        <div className="flex gap-2">
          <input
            className="input-base"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addImage();
              }
            }}
            placeholder="Paste an image URL and press Enter"
          />
          <button
            type="button"
            onClick={addImage}
            className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-ink-700 px-4 text-sm font-semibold text-slate-200 transition hover:bg-ink-600"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
        {/* Quick sample images */}
        <div className="mt-3">
          <p className="mb-2 text-xs text-slate-500">Or pick a sample image:</p>
          <div className="flex flex-wrap gap-2">
            {sampleImages.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => set('images', [...values.images, url])}
                className="h-14 w-20 overflow-hidden rounded-lg border border-white/10 transition hover:border-brand-500/50"
              >
                <SmartImage src={url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        {values.images.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {values.images.map((img, i) => (
              <div key={i} className="relative">
                <SmartImage src={img} alt="" className="h-20 w-28 rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-400"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-ink-950 transition hover:bg-brand-400"
        >
          <Save className="h-4 w-4" /> {existing ? 'Save Changes' : 'Create Account'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/accounts')}
          className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
