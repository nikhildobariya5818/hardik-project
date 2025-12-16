# Shreeram Enterprise - Next.js Application

This is a complete business management application converted from Vite.js to Next.js 16.

## Features

- Client Management
- Order Tracking
- Payment Recording
- Invoice Generation
- Reports & Analytics
- User Authentication with Supabase
- Role-based Access Control (Admin/Staff)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.local` and add your Supabase credentials
   - Get these from your Supabase project settings

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

You need to set the following environment variables in the **Vars** section of the v0 sidebar:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Project Structure

```
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── (dashboard)/     # Protected dashboard pages
│   ├── api/            # API routes
│   └── layout.tsx      # Root layout
├── components/
│   ├── layout/         # Layout components
│   └── ui/             # UI components (shadcn)
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/
│   └── supabase/       # Supabase configuration
└── public/             # Static assets
```

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/clients/*` - Client management
- `/api/orders/*` - Order management
- `/api/payments/*` - Payment tracking
- `/api/settings/*` - Settings management

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: TanStack Query (React Query)

## License

Private - Shreeram Enterprise
