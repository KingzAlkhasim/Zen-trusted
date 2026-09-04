// Central site configuration — change branding, contact, and defaults here.
// Keeping everything in one place makes it trivial to rebrand the app later.

export const siteConfig = {
  // Brand
  brandName: 'Zen Trusted',
  brandTagline: 'Premium Gaming Accounts Marketplace',
  brandShortDesc:
    'Buy verified, high-tier gaming accounts with confidence. Every account is hand-checked before listing.',

  // Contact / social
  whatsappNumber: '2348012345678', // international format, no + or spaces
  email: 'support@zentrusted.example',
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
