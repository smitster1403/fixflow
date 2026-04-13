# FixFlow

Tenant maintenance request tracker for small landlords (5–20 units).

## Tech Stack

- **Next.js 15** (App Router, Turbopack)
- **TypeScript**
- **Supabase** (Postgres, Realtime, Storage)
- **Clerk** (landlord authentication)
- **Tailwind CSS v4**
- **Resend** (email notifications)

## Getting Started

### 1. Clone the repo

```bash
git clone <repo-url>
cd fixflow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in the values in `.env.local`:

| Variable | Source |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk dashboard → API Keys |
| `RESEND_API_KEY` | Resend dashboard → API Keys |

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  (auth)/sign-in/          Clerk sign-in page
  (auth)/sign-up/          Clerk sign-up page
  dashboard/               Protected landlord dashboard
  request/[token]/         Public tenant maintenance request form
components/ui/             Shared UI primitives
lib/
  supabase/client.ts       Browser-side Supabase client
  supabase/server.ts       Server-side Supabase client
  resend.ts                Resend email client
types/index.ts             Shared TypeScript interfaces
middleware.ts              Clerk auth middleware
```
