// Central site configuration — change branding, contact, and defaults here.
export const siteConfig = {
  // Brand
  brandName: 'RankedBay',
  brandTagline: 'Gaming Accounts Marketplace',
  brandShortDesc:
    'Browse gaming accounts by game, rank, region, and features. Find the right account and contact the seller directly.',

  // Contact / social
  // Replace these placeholders before using the template for a real business.
  whatsappNumber: '2348000000000',
  email: 'hello@rankedbay.example',
  instagram: 'https://instagram.com/',
  twitter: 'https://twitter.com/',
  discord: 'https://discord.com/',
  telegram: 'https://t.me/',

  // Currency
  currency: '₦',
  currencyCode: 'NGN',
  locale: 'en-NG',

  // Feature toggles for future backend integration
  features: {
    auth: true,
    payments: false,
    realtime: false,
  },
} as const;

export type SiteConfig = typeof siteConfig;

export function formatPrice(value: number): string {
  return `${siteConfig.currency}${value.toLocaleString(siteConfig.locale)}`;
}

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
