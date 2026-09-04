-- ============================================================
-- Zen Trusted (GameVault) — Full Supabase Setup
-- Run this ONCE in your Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New query → paste → Run)
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS guards
-- (except the two new "gv_profiles insert" policies at the bottom,
-- which will error if run twice — see note there).
-- ============================================================

/*
# GameVault — Full Database Schema

## Overview
Creates the complete schema for the GameVault gaming account marketplace:
- A `gv_profiles` table that extends Supabase auth.users with a username and role.
- An `gv_accounts` table for gaming account listings (managed by the admin).
- An `gv_inquiries` table for customer purchase gv_inquiries sent via WhatsApp.
- A trigger that auto-creates a profile row whenever a new auth user signs up.
- Row Level Security policies on every table.
- Seeds 12 sample gaming account listings and 5 sample gv_inquiries.

## 1. New Tables

### gv_profiles
- `id` (uuid, PK, references auth.users) — one row per signed-up user.
- `username` (text, unique, not null) — display name.
- `role` (text, default 'customer') — 'admin' or 'customer'. Controls admin access.
- `created_at` (timestamptz) — when the profile was created.

### gv_accounts
- `id` (uuid, PK) — unique listing ID.
- `title` (text, not null) — listing title.
- `game` (text, not null) — game slug (free-fire, pubg-mobile, etc.).
- `price` (integer, not null) — price in Nigerian Naira.
- `rank` (text, not null) — account rank.
- `level` (integer) — account level.
- `skins` (integer) — number of skins/items.
- `region` (text) — account region.
- `description` (text, not null) — listing description.
- `features` (text[]) — list of key features.
- `images` (text[]) — image URLs.
- `availability` (text, default 'available') — available, reserved, or sold.
- `featured` (boolean, default false) — show on home page.
- `created_at` (timestamptz) — when the listing was created.

### gv_inquiries
- `id` (uuid, PK) — unique inquiry ID.
- `account_id` (uuid, references gv_accounts) — which listing the inquiry is about.
- `account_title` (text, not null) — snapshot of the listing title.
- `customer_name` (text, not null) — name of the inquiring customer.
- `customer_handle` (text) — WhatsApp / phone number.
- `price` (integer) — snapshot of the price at inquiry time.
- `status` (text, default 'new') — new, contacted, reserved, or completed.
- `message` (text) — the pre-filled WhatsApp message.
- `created_at` (timestamptz) — when the inquiry was created.

## 2. Security (RLS)

### gv_profiles
- SELECT: authenticated users can read all gv_profiles (needed to display usernames).
- UPDATE: users can update only their own profile.

### gv_accounts
- SELECT: public (anon + authenticated) — anyone can browse the marketplace.
- INSERT / UPDATE / DELETE: admin only (role = 'admin' in gv_profiles).

### gv_inquiries
- SELECT: admin only — customers don't need to see gv_inquiries in this MVP.
- INSERT: public (anon + authenticated) — anyone browsing can send an inquiry.
- UPDATE / DELETE: admin only.

## 3. Triggers
- `on_auth_user_created_gv` — fires after a new auth.users row is inserted.
  Inserts a matching row into `gv_profiles` with the email's local part as the
  default username and role 'customer'. This ensures every signed-up user
  has a profile row without requiring a separate API call.

## 4. Seed Data
- 12 realistic gaming account listings across Free Fire, PUBG Mobile,
  Call of Duty Mobile, EA FC Mobile, and Fortnite with Naira prices.
- 5 sample gv_inquiries with various statuses.

## 5. Important Notes
1. The `gv_profiles.role` column is the authorization mechanism for the admin
   dashboard. New signups default to 'customer'. To grant admin access, set
   `role = 'admin'` on the user's profile row directly in the database.
2. Email confirmation is OFF by default — users can sign in immediately
   after signup.
3. The gv_accounts and gv_inquiries tables are readable by the public (anon key)
   so the marketplace works without login. Writes are admin-restricted.
4. Inquiries can be created by anyone (anon) so the "Buy on WhatsApp"
   flow can log an inquiry before redirecting.
*/

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS gv_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'customer',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gv_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_all" ON gv_profiles;
CREATE POLICY "profiles_select_all"
ON gv_profiles FOR SELECT
TO authenticated USING (true);

DROP POLICY IF EXISTS "profiles_update_own" ON gv_profiles;
CREATE POLICY "profiles_update_own"
ON gv_profiles FOR UPDATE
TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============================================================
-- ACCOUNTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS gv_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  game text NOT NULL,
  price integer NOT NULL,
  rank text NOT NULL,
  level integer NOT NULL DEFAULT 1,
  skins integer NOT NULL DEFAULT 0,
  region text NOT NULL DEFAULT 'Global',
  description text NOT NULL,
  features text[] NOT NULL DEFAULT '{}',
  images text[] NOT NULL DEFAULT '{}',
  availability text NOT NULL DEFAULT 'available',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gv_accounts ENABLE ROW LEVEL SECURITY;

-- Public can read listings (marketplace browsing without login)
DROP POLICY IF EXISTS "accounts_select_public" ON gv_accounts;
CREATE POLICY "accounts_select_public"
ON gv_accounts FOR SELECT
TO anon, authenticated USING (true);

-- Admin-only writes
DROP POLICY IF EXISTS "accounts_insert_admin" ON gv_accounts;
CREATE POLICY "accounts_insert_admin"
ON gv_accounts FOR INSERT
TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM gv_profiles WHERE gv_profiles.id = auth.uid() AND gv_profiles.role = 'admin')
);

DROP POLICY IF EXISTS "accounts_update_admin" ON gv_accounts;
CREATE POLICY "accounts_update_admin"
ON gv_accounts FOR UPDATE
TO authenticated USING (
  EXISTS (SELECT 1 FROM gv_profiles WHERE gv_profiles.id = auth.uid() AND gv_profiles.role = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM gv_profiles WHERE gv_profiles.id = auth.uid() AND gv_profiles.role = 'admin')
);

DROP POLICY IF EXISTS "accounts_delete_admin" ON gv_accounts;
CREATE POLICY "accounts_delete_admin"
ON gv_accounts FOR DELETE
TO authenticated USING (
  EXISTS (SELECT 1 FROM gv_profiles WHERE gv_profiles.id = auth.uid() AND gv_profiles.role = 'admin')
);

-- ============================================================
-- INQUIRIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS gv_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES gv_accounts(id) ON DELETE SET NULL,
  account_title text NOT NULL,
  customer_name text NOT NULL,
  customer_handle text,
  price integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'new',
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gv_inquiries ENABLE ROW LEVEL SECURITY;

-- Admin can read gv_inquiries
DROP POLICY IF EXISTS "inquiries_select_admin" ON gv_inquiries;
CREATE POLICY "inquiries_select_admin"
ON gv_inquiries FOR SELECT
TO authenticated USING (
  EXISTS (SELECT 1 FROM gv_profiles WHERE gv_profiles.id = auth.uid() AND gv_profiles.role = 'admin')
);

-- Anyone can create an inquiry (the "Buy on WhatsApp" flow)
DROP POLICY IF EXISTS "inquiries_insert_public" ON gv_inquiries;
CREATE POLICY "inquiries_insert_public"
ON gv_inquiries FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- Admin can update inquiry status
DROP POLICY IF EXISTS "inquiries_update_admin" ON gv_inquiries;
CREATE POLICY "inquiries_update_admin"
ON gv_inquiries FOR UPDATE
TO authenticated USING (
  EXISTS (SELECT 1 FROM gv_profiles WHERE gv_profiles.id = auth.uid() AND gv_profiles.role = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM gv_profiles WHERE gv_profiles.id = auth.uid() AND gv_profiles.role = 'admin')
);

-- Admin can delete gv_inquiries
DROP POLICY IF EXISTS "inquiries_delete_admin" ON gv_inquiries;
CREATE POLICY "inquiries_delete_admin"
ON gv_inquiries FOR DELETE
TO authenticated USING (
  EXISTS (SELECT 1 FROM gv_profiles WHERE gv_profiles.id = auth.uid() AND gv_profiles.role = 'admin')
);

-- ============================================================
-- TRIGGER: Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.gv_handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.gv_profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_gv ON auth.users;
CREATE TRIGGER on_auth_user_created_gv
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.gv_handle_new_user();

-- ============================================================
-- SEED DATA: Sample gv_accounts
-- ============================================================
INSERT INTO gv_accounts (title, game, price, rank, level, skins, region, description, features, images, availability, featured)
VALUES
  (
    'Heroic Bundle — Full Rare Collection',
    'free-fire', 75000, 'Heroic', 75, 42, 'Asia',
    'Top-tier Free Fire account with Heroic rank and a massive collection of rare bundles, elite passes and exclusive weapon skins. Bound email is fully transferable.',
    ARRAY['Heroic rank (Season 28)', '42 rare bundles & outfits', 'Elite Pass Bundle (all seasons)', 'Full AK & M4 rare skin set', 'Email transferable'],
    ARRAY['https://images.pexels.com/photos/9072216/pexels-photo-9072216.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/34543044/pexels-photo-34543044.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/14201953/pexels-photo-14201953.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    'available', true
  ),
  (
    'Grandmaster Account — Premium Outfits',
    'free-fire', 50000, 'Grandmaster', 68, 30, 'Middle East',
    'Grandmaster Free Fire account loaded with premium outfits and weapon skins. Great value for collectors.',
    ARRAY['Grandmaster rank', '30 premium outfits', 'Cobra Bundle included', 'Rare emote collection'],
    ARRAY['https://images.pexels.com/photos/9072202/pexels-photo-9072202.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/7862267/pexels-photo-7862267.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/7792253/pexels-photo-7792253.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    'available', true
  ),
  (
    'Conqueror PUBG — Mythic Outfits & M416 Glacier',
    'pubg-mobile', 75000, 'Conqueror', 80, 55, 'Asia',
    'Conqueror tier PUBG Mobile account featuring the coveted M416 Glacier skin, mythic outfits and a huge inventory of weapon skins.',
    ARRAY['Conqueror rank (current season)', 'M416 Glacier (upgradable)', '55 mythic & legendary outfits', 'Rare vehicle skins', 'Full UC history clean'],
    ARRAY['https://images.pexels.com/photos/7862508/pexels-photo-7862508.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/34543044/pexels-photo-34543044.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/14201953/pexels-photo-14201953.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    'available', true
  ),
  (
    'Crown V PUBG — Solid Mid-Tier Account',
    'pubg-mobile', 25000, 'Crown V', 55, 22, 'Europe',
    'Well-rounded PUBG Mobile account at Crown V rank with a good selection of outfits and weapon skins. Perfect entry-level premium account.',
    ARRAY['Crown V rank', '22 outfits & skins', 'AKM & Kar98 skins', 'Season RP pass completed'],
    ARRAY['https://images.pexels.com/photos/30469968/pexels-photo-30469968.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/7862267/pexels-photo-7862267.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/7792253/pexels-photo-7792253.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    'reserved', false
  ),
  (
    'Legendary CODM — Rare Operators & Weapons',
    'cod-mobile', 50000, 'Legendary', 150, 48, 'Global',
    'Legendary rank Call of Duty Mobile account with rare operators, legendary weapon blueprints and a full battle pass history.',
    ARRAY['Legendary rank', '48 legendary blueprints', 'Rare operators (Ghost, Price)', 'All battle passes completed', 'Mythic weapon included'],
    ARRAY['https://images.pexels.com/photos/16311112/pexels-photo-16311112.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/34543044/pexels-photo-34543044.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/14201953/pexels-photo-14201953.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    'available', true
  ),
  (
    'Elite CODM — High Rank Starter',
    'cod-mobile', 35000, 'Elite', 120, 28, 'Asia',
    'Elite rank CODM account with a solid collection of legendary weapons and operators. Great value for competitive players.',
    ARRAY['Elite rank', '28 legendary blueprints', '3 rare operators', 'Battle pass (current season)'],
    ARRAY['https://images.pexels.com/photos/27424789/pexels-photo-27424789.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/7862267/pexels-photo-7862267.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/7792253/pexels-photo-7792253.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    'available', false
  ),
  (
    'Ultimate Team — TOTY & Icon Players',
    'ea-fc-mobile', 75000, 'Division 1', 90, 35, 'Global',
    'EA FC Mobile Ultimate Team stacked with Team of the Year players, Icons and a 110+ OVR squad. Full club value retained.',
    ARRAY['Division 1 rank', 'TOTY players (x3)', 'Icon players (x2)', '110+ OVR squad', 'Full coin & points balance'],
    ARRAY['https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/34543044/pexels-photo-34543044.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/14201953/pexels-photo-14201953.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    'available', true
  ),
  (
    'Division 3 EA FC — Solid Starter Squad',
    'ea-fc-mobile', 15000, 'Division 3', 60, 18, 'Europe',
    'Division 3 EA FC Mobile account with a balanced squad and decent coin balance. Ideal for players building up their Ultimate Team.',
    ARRAY['Division 3 rank', '18 special players', '100+ OVR squad', 'Healthy coin balance'],
    ARRAY['https://images.pexels.com/photos/9072376/pexels-photo-9072376.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/7862267/pexels-photo-7862267.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/7792253/pexels-photo-7792253.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    'sold', false
  ),
  (
    'OG Fortnite — Rare OG Skins & Pickaxes',
    'fortnite', 50000, 'Champion League', 200, 60, 'Global',
    'OG Fortnite account with rare Chapter 1 skins, exclusive pickaxes and a full battle pass collection. A true collector piece.',
    ARRAY['Champion League rank', 'OG Renegade Raider', 'OG Skull Trooper', '60 rare skins & pickaxes', 'Full battle pass history'],
    ARRAY['https://images.pexels.com/photos/31971487/pexels-photo-31971487.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/34543044/pexels-photo-34543044.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/14201953/pexels-photo-14201953.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    'available', true
  ),
  (
    'Arena Fortnite — Mid-Season Account',
    'fortnite', 25000, 'Arena Division 7', 120, 32, 'NA-East',
    'Solid Fortnite account with a good skin collection and competitive arena rank. Great for players who want a head start.',
    ARRAY['Arena Division 7', '32 skins & emotes', 'Current battle pass (tier 80)', 'Exclusive pickaxe set'],
    ARRAY['https://images.pexels.com/photos/31971487/pexels-photo-31971487.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/7862267/pexels-photo-7862267.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/7792253/pexels-photo-7792253.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    'available', false
  ),
  (
    'Diamond Free Fire — Budget Heroic Ready',
    'free-fire', 15000, 'Diamond', 45, 15, 'Asia',
    'Budget-friendly Free Fire account at Diamond rank with a decent skin collection. Ready to push for Heroic with a bit of effort.',
    ARRAY['Diamond rank', '15 outfits & skins', 'Elite Pass (last 3 seasons)', 'Bound email transferable'],
    ARRAY['https://images.pexels.com/photos/9072202/pexels-photo-9072202.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/34543044/pexels-photo-34543044.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/14201953/pexels-photo-14201953.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    'available', false
  ),
  (
    'Ace Master PUBG — Balanced Loadout',
    'pubg-mobile', 35000, 'Ace Master', 60, 26, 'Asia',
    'Ace Master PUBG Mobile account with a balanced loadout of mythic outfits and weapon skins. Good value mid-tier account.',
    ARRAY['Ace Master rank', '26 outfits & skins', 'M416 & AKM skins', 'Vehicle skins included'],
    ARRAY['https://images.pexels.com/photos/7862508/pexels-photo-7862508.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/7862267/pexels-photo-7862267.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/7792253/pexels-photo-7792253.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    'reserved', false
  )
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA: Sample gv_inquiries (linked to seeded gv_accounts by title)
-- ============================================================
INSERT INTO gv_inquiries (account_title, customer_name, customer_handle, price, status, message)
VALUES
  ('Heroic Bundle — Full Rare Collection', 'Daniel O.', '+234 803 000 1111', 75000, 'new', 'Hello, I am interested in buying Heroic Bundle — Full Rare Collection for ₦75,000. Is it still available?'),
  ('Conqueror PUBG — Mythic Outfits & M416 Glacier', 'Fatima A.', '+234 805 222 3333', 75000, 'contacted', 'Hello, I am interested in buying Conqueror PUBG — Mythic Outfits & M416 Glacier for ₦75,000. Is it still available?'),
  ('Crown V PUBG — Solid Mid-Tier Account', 'Emeka N.', '+234 802 444 5555', 25000, 'reserved', 'Hello, I am interested in buying Crown V PUBG — Solid Mid-Tier Account for ₦25,000. Is it still available?'),
  ('Division 3 EA FC — Solid Starter Squad', 'Grace I.', '+234 807 666 7777', 15000, 'completed', 'Hello, I am interested in buying Division 3 EA FC — Solid Starter Squad for ₦15,000. Is it still available?'),
  ('OG Fortnite — Rare OG Skins & Pickaxes', 'Tunde B.', '+234 809 888 9999', 50000, 'new', 'Hello, I am interested in buying OG Fortnite — Rare OG Skins & Pickaxes for ₦50,000. Is it still available?')
ON CONFLICT DO NOTHING;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_accounts_game ON gv_accounts(game);
CREATE INDEX IF NOT EXISTS idx_accounts_availability ON gv_accounts(availability);
CREATE INDEX IF NOT EXISTS idx_accounts_featured ON gv_accounts(featured);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON gv_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON gv_profiles(role);
-- Allow authenticated users to insert their own profile (safety net in case trigger fails)
DROP POLICY IF EXISTS "profiles_insert_own" ON gv_profiles;
CREATE POLICY "profiles_insert_own" ON gv_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow anon to insert gv_profiles (needed if trigger runs before auth context is established)
DROP POLICY IF EXISTS "profiles_insert_anon" ON gv_profiles;
CREATE POLICY "profiles_insert_anon" ON gv_profiles
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
