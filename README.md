# Retail OS Frontend - Next.js Application

Modern React-based frontend for the Retail OS Dashboard using Next.js and shadcn/ui.

## Overview

This is a Next.js 16+ application that provides the user interface for the Retail OS Dashboard. It features:

- Responsive dashboard with real-time metrics
- Inventory management interface
- Activity feed and transaction history
- Admin panel for configuration management
- Full TypeScript support

## Features

- **Next.js App Router** for modern routing
- **Server-Side Rendering** for performance
- **SWR for Data Fetching** with caching and revalidation
- **shadcn/ui Components** for professional UI
- **Tailwind CSS** for styling
- **TypeScript** for type safety
- **Admin Authentication** for secured settings

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm, npm, or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Application runs on: `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
next-app/
├── app/
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Dashboard page
│   ├── admin/
│   │   └── page.tsx             # Admin configuration
│   └── globals.css              # Global styles
├── components/
│   ├── header.tsx               # Header with metrics
│   ├── dashboard.tsx            # Main dashboard
│   ├── alert-cards.tsx          # Alert cards
│   ├── activity-feed.tsx        # Activity feed
│   ├── inventory-view.tsx       # Inventory table
│   ├── metric-card.tsx          # Metric card component
│   ├── metric-detail-modal.tsx  # Details modal
│   ├── admin/
│   │   └── config-form.tsx      # Admin form
│   └── ui/                      # shadcn/ui components
├── hooks/
│   ├── useMetrics.ts            # Fetch metrics
│   ├── useBatchData.ts          # Fetch inventory
│   ├── useActivityFeed.ts       # Fetch activity
│   ├── useConfig.ts             # Fetch config
│   └── useAdminAuth.ts          # Admin auth
├── lib/
│   ├── api.ts                   # API client
│   └── utils.ts                 # Utilities
├── public/                      # Static assets
└── styles/                      # Additional styles
```

## Components

### Header
Displays top metrics and navigation:
- Today's sales
- Gross margin
- Waste amount
- Search functionality
- Notifications badge
- User profile menu

### Dashboard Layout
Three-column responsive layout:
- Header (top)
- Alert Cards (below header)
- Activity Feed (left sidebar)
- Inventory View (main content)
- Bottom Action Bar

### Alert Cards
Metric cards showing:
- Expiring Soon items
- Stockout Risk items
- Clickable for details modal

### Inventory Table
Shows all inventory with:
- Product name and category
- Batch information
- Quantity in stock
- Expiry date
- Days until expiry
- Price at risk

### Activity Feed
Transaction history with:
- Event type (sale, delivery, waste, alert)
- Event description
- Transaction amount
- Timestamp

### Admin Panel
Configuration management:
- Edit expiry thresholds
- Edit stockout thresholds
- Modify calculation formulas
- Change markdown percentages
- Update business rules

## Custom Hooks

### useMetrics
Fetch dashboard metrics with SWR:
```typescript
const { metrics, isLoading, error } = useMetrics()
```

### useBatchData
Fetch inventory batches:
```typescript
const { batches, isLoading, error } = useBatchData()
```

### useActivityFeed
Fetch transaction history:
```typescript
const { activities, isLoading, error } = useActivityFeed()
```

### useConfig
Fetch configuration:
```typescript
const { config, isLoading, error } = useConfig()
```

### useAdminAuth
Handle admin authentication:
```typescript
const { isAuthenticated, login, logout } = useAdminAuth()
```

## API Client (lib/api.ts)

Type-safe API client using SWR:

```typescript
import { fetchAPI } from '@/lib/api'

// Fetch with automatic error handling
const data = await fetchAPI('/api/dashboard-metrics')
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Styling

Uses Tailwind CSS v4 with:
- Design tokens in `globals.css`
- shadcn/ui component library
- Responsive design (mobile-first)
- Semantic HTML

## Adding New Features

### Step 1: Create API Hook
Create hook in `hooks/`:
```typescript
export function useMyData() {
  const { data, isLoading, error } = useSWR(
    '/api/my-endpoint',
    fetchAPI
  )
  return { data, isLoading, error }
}
```

### Step 2: Create Component
Create component in `components/`:
```typescript
'use client'
import { useMyData } from '@/hooks/useMyData'

export default function MyComponent() {
  const { data, isLoading } = useMyData()
  return <div>{/* Render data */}</div>
}
```

### Step 3: Add Page (if needed)
Create page in `app/`:
```typescript
import MyComponent from '@/components/my-component'

export default function MyPage() {
  return <MyComponent />
}
```

## Authentication

Admin panel uses simple token-based auth:

Login credentials:
- Username: `admin`
- Password: `retail123`

Token stored in localStorage with 24-hour expiry.

**For production**, replace with real authentication (OAuth, Auth0, etc.)

## Performance Tips

1. **Use SWR** for data fetching with automatic caching
2. **Server Components** for static content
3. **Code Splitting** with dynamic imports
4. **Image Optimization** with Next.js Image component
5. **CSS Optimization** with Tailwind purge

## Troubleshooting

### API Connection Failed
Check `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Ensure backend is running on port 8000

### Styles Not Loading
```bash
# Rebuild CSS
npm run build
npm run dev
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Build Error
```bash
# Clean build
npm run clean
npm run build
```

## Development Workflow

1. **Start backend**: `cd backend && python main.py`
2. **Start frontend**: `npm run dev`
3. **Edit components** and see hot reload
4. **Check API docs** at `http://localhost:8000/docs`
5. **Visit admin panel** at `http://localhost:3000/admin`

## Testing

Run tests (when configured):
```bash
npm run test
```

## Deployment

### Vercel (Recommended)
```bash
# Login to Vercel
npx vercel login

# Deploy
npx vercel
```

### Docker
```bash
docker build -t retail-os-frontend .
docker run -p 3000:3000 retail-os-frontend
```

### Manual
```bash
npm run build
npm start
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Next Steps

1. Review components in `components/`
2. Check hooks in `hooks/`
3. Explore admin panel at `/admin`
4. Modify dashboard layout in `page.tsx`
5. Add new pages to `app/`

---

For full project documentation, see `../../QUICK_START.md`
 
