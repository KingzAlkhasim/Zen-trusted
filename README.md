# Zen Trusted — Premium Gaming Accounts Marketplace

A full-featured marketplace for buying and selling verified gaming accounts. Built with React, Vite, Tailwind CSS, and Supabase (PostgreSQL + Auth).

## Features

### Public Store
- **Home page** with hero section, featured listings, and game category showcase
- **Marketplace** with search, game filter, and availability filtering
- **Account details** page with image gallery, stats, features, and WhatsApp purchase flow
- **About / FAQ** page
- Responsive design across all screen sizes

### Authentication
- **Sign up** with email, password, and username
- **Sign in** with email and password
- Session persistence across page reloads
- Protected admin routes (redirects unauthorized users)
- Sign out from both the store header and admin sidebar

### Admin Dashboard (protected)
- **Overview** — stats summary, recent accounts, and recent inquiries
- **Accounts management** — view, add, edit, delete, and change availability
- **Add / Edit account** — full form with title, game, price, rank, level, skins, region, description, features, images, availability, and featured flag
- **Inquiries** — view and update inquiry statuses (new, contacted, reserved, completed)
- **Users** — registered users overview

### Database (Supabase)
- **profiles** table — extends Supabase Auth users with username and role (admin/customer)
- **accounts** table — gaming account listings with full metadata
- **inquiries** table — customer purchase inquiries from the WhatsApp flow
- Row Level Security (RLS) on every table
- Auto-creates profile on signup via database trigger
- 12 sample account listings and 5 sample inquiries pre-seeded

## Tech Stack

- **Frontend:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Routing:** React Router v6
- **Backend:** Supabase (PostgreSQL, Auth, RLS)

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

### Environment Variables

The following are pre-configured in `.env`:

```
VITE_SUPABASE_URL=<your-project-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

### Granting Admin Access

New signups default to the `customer` role. To grant a user admin access:

1. Sign up an account through the app
2. Run this SQL in the Supabase SQL editor:

```sql
UPDATE profiles SET role = 'admin' WHERE username = 'your_username';
```

3. Sign out and sign back in — the user will now see the "Dashboard" link and can access `/admin`.

## Database Schema

### profiles
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | References `auth.users(id)` |
| username | text (unique) | Display name |
| role | text | `admin` or `customer` |
| created_at | timestamptz | Creation timestamp |

### accounts
| Column | Type | Description |
|--------|------|-------------|
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
| availability | text | `available`, `reserved`, or `sold` |
| featured | boolean | Show on home page |
| created_at | timestamptz | Creation timestamp |

### inquiries
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Inquiry ID |
| account_id | uuid (FK) | References `accounts(id)` |
| account_title | text | Snapshot of listing title |
| customer_name | text | Inquiring customer name |
| customer_handle | text | WhatsApp / phone |
| price | integer | Price at inquiry time |
| status | text | `new`, `contacted`, `reserved`, or `completed` |
| message | text | WhatsApp message |
| created_at | timestamptz | Creation timestamp |

## Security

- **Row Level Security** is enabled on all tables
- Public (anon) users can read account listings and create inquiries
- Only authenticated admins can create, update, and delete listings
- Only authenticated admins can read and update inquiries
- Users can update only their own profile
- Profile creation is automatic via a database trigger on signup

## Build

```bash
npm run build      # Production build
npm run typecheck  # Type checking only
npm run lint       # ESLint
```

## License

Built as a demo project. No real transactions are processed.
