# RankedBay — Gaming Accounts Marketplace

A ready-to-customize marketplace template for buying and selling gaming accounts. Built with React, Vite, TypeScript, Tailwind CSS, and Supabase (PostgreSQL + Auth).

## Features

### Public Store
- **Home page** with hero section, featured listings, and game categories
- **Marketplace** with search, game filters, and availability filtering
- **Account details** with image gallery, stats, features, and WhatsApp purchase flow
- **About / FAQ** page
- Responsive design across desktop and mobile

### Authentication
- Sign up with email, password, and username
- Sign in with email and password
- Session persistence across reloads
- Protected admin routes
- Sign out from the store and admin dashboard

### Admin Dashboard
- Overview statistics and recent activity
- Add, edit, delete, and manage account listings
- Update listing availability and featured status
- Manage customer inquiries
- View registered users

### Supabase Backend
- profiles table for user roles and profiles
- accounts table for gaming listings
- inquiries table for purchase enquiries
- Row Level Security (RLS)
- Automatic profile creation on signup
- Seed data for demonstration

## Tech Stack

- **Frontend:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Routing:** React Router v6
- **Backend:** Supabase PostgreSQL + Auth + RLS

## Getting Started

### Requirements
- Node.js 18+
- npm
- A Supabase project

### Installation
```bash
npm install
npm run dev
```

The app runs on http://localhost:5173.

### Environment Variables

Create a .env file:
```
VITE_SUPABASE_URL=<your-project-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

Never include private Supabase service-role keys in the frontend or in a distributed source-code package.

### Granting Admin Access

New signups default to the customer role. To grant a user admin access, update their profile in the Supabase SQL editor:
```sql
UPDATE profiles SET role = 'admin' WHERE username = 'your_username';
```

Then sign out and sign back in.

## Database Schema

### profiles

| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | References auth.users(id) |
| username | text (unique) | Display name |
| role | text | admin or customer |
| created_at | timestamptz | Creation timestamp |

### accounts

| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Listing ID |
| title | text | Listing title |
| game | text | Game slug |
| price | integer | Price in NGN |
| rank | text | Account rank |
| level | integer | Account level |
| skins | integer | Number of skins |
| region | text | Account region |
| description | text | Listing description |
| features | text[] | Key features |
| images | text[] | Image URLs |
| availability | text | available, reserved, or sold |
| featured | boolean | Show on home page |
| created_at | timestamptz | Creation timestamp |

### inquiries

| Column | Type | Description |
|---|---|---|
| id | uuid | Inquiry ID |
| account_id | uuid (FK) | References accounts(id) |
| account_title | text | Listing title snapshot |
| customer_name | text | Customer name |
| customer_handle | text | WhatsApp / phone |
| price | integer | Price at inquiry time |
| status | text | new, contacted, reserved, or completed |
| message | text | Customer message |
| created_at | timestamptz | Creation timestamp |

## Security
- Row Level Security is enabled on the application tables.
- Public users can browse available listings and create inquiries.
- Authenticated admins can manage listings and inquiries.
- Users can update their own profiles.

## Customization

Before deploying this template for a real business, update the central configuration in src/config/site.ts.

Replace the placeholder:
- brand name and tagline
- WhatsApp number
- email address
- social links
- currency settings

Also replace demonstration listings and images with content you have permission to use.

## Build and Quality Checks
```bash
npm run build
npm run typecheck
npm run lint
```

## Payments

The current template uses a direct WhatsApp inquiry flow. Online payments are intentionally disabled in the base version and can be integrated later with a provider such as Paystack or Stripe.

## License

This package is intended as a customizable marketplace template. Buyers should verify that all included assets, content, branding, and third-party resources are appropriately licensed for their intended use.
