// Domain types — these match the Supabase database column names exactly.

export type GameSlug =
  | 'free-fire'
  | 'pubg-mobile'
  | 'cod-mobile'
  | 'ea-fc-mobile'
  | 'fortnite';

export interface Game {
  slug: GameSlug;
  name: string;
  shortName: string;
  accent: string; // tailwind gradient classes for the game tile
  emoji: string;
}

export type Availability = 'available' | 'reserved' | 'sold';

export interface AccountListing {
  id: string;
  title: string;
  game: string;
  price: number; // in NGN
  rank: string;
  level: number;
  skins: number;
  region: string;
  description: string;
  features: string[];
  images: string[];
  availability: Availability;
  featured: boolean;
  created_at: string; // ISO date
}

export type InquiryStatus = 'new' | 'contacted' | 'reserved' | 'completed';

export interface Inquiry {
  id: string;
  account_id: string | null;
  account_title: string;
  customer_name: string;
  customer_handle: string | null;
  price: number;
  status: InquiryStatus;
  created_at: string;
  message: string | null;
}
