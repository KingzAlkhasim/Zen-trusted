# RankedBay — Gaming Accounts Marketplace

**RankedBay** is a ready-to-customize gaming account marketplace template for sellers, gaming communities, and small marketplaces.

**Live demo:** https://rankedbay.vercel.app/

Built with **React 18, Vite, TypeScript, Tailwind CSS, React Router, Lucide React, and Supabase**.

> **Template note:** The base version uses a direct WhatsApp enquiry flow. Online payments are not included by default.

---

## Features

- Responsive marketplace homepage with featured listings and game categories
- Search, game and availability filters
- Account detail pages with galleries, rank, level, skins, region and features
- Direct WhatsApp enquiry flow
- Email/password authentication with persistent Supabase sessions
- Protected admin dashboard for listings and enquiries
- Supabase PostgreSQL, Auth and Row Level Security
- Demonstration/seed data

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 |
| Build | Vite 5 |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Routing | React Router 6 |
| Icons | Lucide React |
| Backend | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| Security | PostgreSQL Row Level Security |
| Deployment | Vercel or compatible hosting |

## Project Structure

```text
RankedBay/
├── api/
├── documentation/
├── src/
│   ├── components/
│   ├── config/site.ts
│   ├── lib/
│   └── pages/
├── supabase/
├── index.html
├── package.json
├── vercel.json
└── README.md
```

## Installation

### Requirements
- Node.js 18+
- npm
- A Supabase project

### Install

```bash
npm install
npm run dev
```

### Environment

Create a .env file:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Never include a Supabase service-role key in frontend code or in a distributed package.

## Supabase Setup

Apply the SQL/schema files in the supabase/ directory to your own Supabase project. New signups default to the customer role.

To grant admin access:

```sql
UPDATE profiles
SET role = 'admin'
WHERE username = 'your_username';
```

Sign out and sign back in after changing the role. Keep Row Level Security enabled.

## Customization

Most branding and contact settings are centralized in src/config/site.ts.

Update the brand name, tagline, description, WhatsApp number, email, social links, currency and locale.

Before launch, replace demonstration listings, images, contacts and placeholder content with material you have permission to use.

## Payments

The base template does **not** include online payment processing. The default flow is listing → account details → WhatsApp enquiry → seller completes the transaction.

Paystack or Stripe can be integrated separately with appropriate server-side verification, webhooks, order records and payment status handling.

## Deployment

RankedBay can be deployed to Vercel or another platform that serves the built Vite application.

1. Import the project.
2. Add the Supabase environment variables.
3. Deploy.
4. Test authentication, listings, images and enquiry flows.
5. Configure the production domain.

The included vercel.json provides the SPA rewrite required for client-side routes.

## Build & Quality Checks

```bash
npm run build
npm run typecheck
npm run lint
```

For local production preview:

```bash
npm run build
npm run preview
```

## Documentation

A standalone HTML product manual is included at documentation/index.html.

It covers installation, Supabase setup, configuration, admin setup, database structure, deployment, customization, payments, troubleshooting and licensing notes.

## Security & Licensing

Before deploying or distributing a customized copy:
- Remove private credentials and secrets.
- Never ship Supabase service-role credentials.
- Replace placeholder contact information and demo assets.
- Review third-party library and asset licenses.
- Configure your own Supabase project.
- Verify that intended gaming-account marketplace use complies with applicable platform rules and laws.

The buyer is responsible for their own deployment, backend, content, payment provider, domain and business compliance.

## Support

For installation or customization questions, check documentation/index.html and this README. For deployment-specific issues, check the browser console, hosting logs and Supabase logs.

## Product Information

**Product:** RankedBay — Gaming Accounts Marketplace  
**Version:** 1.0.0  
**Demo:** https://rankedbay.vercel.app/  
**Repository:** https://github.com/KingzAlkhasim/Zen-trusted  
**Author:** KingzAlkhasim

---

**RankedBay — Gaming Accounts Marketplace**
*Browse. List. Connect.*