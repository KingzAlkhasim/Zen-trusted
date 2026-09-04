import type { Game, GameSlug } from '@/types';

export const games: Game[] = [
  {
    slug: 'free-fire',
    name: 'Free Fire',
    shortName: 'Free Fire',
    accent: 'from-orange-500/80 to-red-600/80',
    emoji: '🔥',
  },
  {
    slug: 'pubg-mobile',
    name: 'PUBG Mobile',
    shortName: 'PUBG',
    accent: 'from-amber-500/80 to-yellow-600/80',
    emoji: '🎯',
  },
  {
    slug: 'cod-mobile',
    name: 'Call of Duty Mobile',
    shortName: 'CODM',
    accent: 'from-slate-400/80 to-slate-600/80',
    emoji: '🔫',
  },
  {
    slug: 'ea-fc-mobile',
    name: 'EA FC Mobile',
    shortName: 'EA FC',
    accent: 'from-emerald-500/80 to-teal-600/80',
    emoji: '⚽',
  },
  {
    slug: 'fortnite',
    name: 'Fortnite',
    shortName: 'Fortnite',
    accent: 'from-sky-500/80 to-blue-600/80',
    emoji: '🌀',
  },
];

export const gameMap: Record<GameSlug, Game> = Object.fromEntries(
  games.map((g) => [g.slug, g]),
) as Record<GameSlug, Game>;

export function gameBySlug(slug: string): Game | undefined {
  return gameMap[slug as GameSlug];
}
