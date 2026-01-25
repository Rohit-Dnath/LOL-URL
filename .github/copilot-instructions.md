# LOL URL - AI Coding Agent Instructions

## Project Overview
LOL URL is a modern URL shortener built with **React (Vite) + Supabase + Tailwind CSS**. Users can shorten URLs, generate QR codes, and track detailed analytics (clicks, location, device stats). Authentication is handled via Supabase Auth.

## Architecture

### Tech Stack
- **Frontend**: React 18, Vite, React Router v7, Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL database, Auth, Storage for QR codes/profile pics)
- **Deployment**: Vercel
- **Styling**: Tailwind with custom design system (see [tailwind.config.js](../tailwind.config.js))

### Key Patterns

#### 1. Database Access Layer (`src/db/`)
All Supabase operations are abstracted into dedicated API files:
- `apiAuth.js` - Authentication (login, signup, getCurrentUser, logout)
- `apiUrls.js` - URL CRUD operations (getUrls, createUrl, deleteUrl, getLongUrl)
- `apiClicks.js` - Analytics tracking (getClicksForUrls, storeClicks)
- `supabase.js` - Supabase client initialization with env vars

**Pattern**: Never call `supabase` directly in components. Always use these API functions.

#### 2. Custom `useFetch` Hook (`src/hooks/use-fetch.jsx`)
Wrapper for async operations with loading/error states:
```jsx
const {data, loading, error, fn} = useFetch(apiFunction);
// Call fn(...args) to execute, data/loading/error update automatically
```
**Usage**: All async operations (DB calls, auth) should use this hook for consistent state management.

#### 3. Global Auth Context (`src/context.jsx`)
- Provides `user`, `fetchUser`, `loading`, `isAuthenticated` via `UrlState()` hook
- Authentication check: `user?.role === "authenticated"`
- Always use `UrlState()` instead of direct Supabase auth calls

#### 4. Component Structure
- **Pages**: [src/pages/](../src/pages/) (landing, dashboard, auth, link, redirect-link)
- **Shared Components**: [src/components/](../src/components/) (create-link, link-card, location-stats, device-stats)
- **UI Components**: [src/components/ui/](../src/components/ui/) (shadcn/ui - button, dialog, input, etc.)
- **Layouts**: [src/layouts/app-layout.jsx](../src/layouts/app-layout.jsx) (contains Header, handles navigation)

**Import Alias**: Use `@/` for src imports (configured in [vite.config.js](../vite.config.js))

#### 5. Routing (React Router v7)
- Defined in [src/App.jsx](../src/App.jsx) with `createBrowserRouter`
- Protected routes use `<RequireAuth>` wrapper component
- Custom URL redirects handled by [redirect-link.jsx](../src/pages/redirect-link.jsx) and [redirect-handler.jsx](../src/components/redirect-handler.jsx)

## Development Workflow

### Running Locally
```bash
npm run dev        # Standard dev server (localhost:5173)
npm run chala      # Alias for dev (cultural preference, don't remove)
npm run build      # Production build
npm run preview    # Preview production build
```
**Port Note**: Dev server typically runs on `http://localhost:5173`. If port is in use, Vite auto-switches to 5174 or next available port. Always check terminal output for actual port.

### Environment Variables
Required in `.env` (must be at project root):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your_supabase_anon_key
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx (optional)
VITE_SUPABASE_SECRET_KEY=sb_secret_xxx (optional)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx (for Vercel Blob storage)
```
**Critical**: 
- All env vars must be prefixed with `VITE_` to be accessible in client code via `import.meta.env.VITE_*`
- After changing `.env`, **restart the dev server** (Vite doesn't hot-reload env changes)
- Blank screen issues often indicate missing/incorrect Supabase credentials

### Database Schema
See [docs/database.md](../docs/database.md) for complete schema. Key tables:
- `urls` - Stores original_url, short_url, custom_url, qr (QR code image URL), user_id
- `clicks` - Analytics data (country, city, device info)
- Supabase Storage buckets: `qrs` (QR codes), `profile-pic` (user avatars)

## Code Conventions

### Styling
- Use Tailwind utility classes (no inline styles or CSS modules)
- UI components follow shadcn/ui patterns with `cn()` utility ([src/lib/utils.js](../src/lib/utils.js))
- Toast notifications: Use `react-toastify` with config from [src/utils/toastConfig.js](../src/utils/toastConfig.js)
- Theme: Dark mode preferred, uses CSS variables defined in [src/index.css](../src/index.css)
- Responsive design: Use `sm:`, `md:`, `lg:` breakpoints consistently (see [create-link.jsx](../src/components/create-link.jsx) for examples)

### Error Handling
```jsx
// Standard pattern in components:
if (error) return <Error message={error.message} />;
if (loading) return <BeatLoader />; // from react-spinners
```
**Important**: All DB API functions throw errors on failure - wrap in try/catch or rely on `useFetch` error handling.

### Form Validation
- Use `yup` for schema validation (see [create-link.jsx](../src/components/create-link.jsx) L15 for example)
- Display errors via `<Error>` component with field-specific messages
- Validate custom URLs for uniqueness using `checkCustomUrlExists` before submission

### QR Code Generation
- Use `react-qrcode-logo` library (see [create-link.jsx](../src/components/create-link.jsx))
- QR codes stored in Supabase Storage, URL saved to `urls.qr` field
- QR customization: Colors, logos, sizes all configurable (extensive UI in CreateLink component)
- Support both pattern types: `squares` (default) and `dots` (rounded)

## Important Implementation Details

### URL Shortening Logic
1. Generate random 4-char short_url: `Math.random().toString(36).substring(2, 6)`
2. Allow optional custom_url (check uniqueness via `checkCustomUrlExists`)
3. Store QR code to Supabase Storage first, then insert URL record
4. Short URL format: `{domain}/{short_url or custom_url}`
5. **Validation**: Custom URLs must be unique - check before submission to avoid errors

### Redirect Handling
- [redirect-link.jsx](../src/pages/redirect-link.jsx) fetches long URL by short code
- [redirect-handler.jsx](../src/components/redirect-handler.jsx) logs click analytics
- Uses Supabase RPC or direct inserts for click tracking
- Device detection normalizes to `Mobile` or `Desktop` (see [device-stats.jsx](../src/components/device-stats.jsx))
- **Critical**: Both components handle the same route (`/:id`) - redirect-handler is the active implementation

### Analytics Components
- [location-stats.jsx](../src/components/location-stats.jsx) - Country/city breakdown (LineChart from recharts)
- [device-stats.jsx](../src/components/device-stats.jsx) - Device type distribution (PieChart)
- Both use aggregated click data from `clicks` table joined with `urls`
- Device normalization: mobile/android/iphone → `Mobile`, everything else → `Desktop`

### Authentication Flow
- Login/Signup handled in [auth.jsx](../src/pages/auth.jsx) with tab switching
- Profile pictures uploaded to `profile-pic` bucket during signup
- RequireAuth component redirects to `/auth` if not authenticated
- Auth state persists via Supabase session management (auto-refresh)

## Common Tasks

### Adding New DB Operations
1. Add function to appropriate `src/db/api*.js` file
2. Use Supabase query builder pattern: `.from(table).select().eq().single()`
3. Throw descriptive errors: `throw new Error("Unable to load X")`
4. Always return data from async functions for `useFetch` compatibility

### Creating New UI Components
1. Use shadcn/ui components from [src/components/ui/](../src/components/ui/)
2. Extend with Tailwind classes, maintain consistent spacing/colors
3. Follow composition pattern (Button → Dialog → Form structure)
4. For responsive designs, check mobile-first breakpoints (see create-link.jsx L200-250)

### Adding New Routes
1. Add route object to `router` in [src/App.jsx](../src/App.jsx)
2. Wrap protected routes with `<RequireAuth>` element
3. Include SEO meta tags inline (see existing routes for pattern)
4. Test both authenticated and non-authenticated states

### Debugging Common Issues
- **Blank Screen**: Check browser console, verify `.env` has correct Supabase credentials, restart dev server
- **Port Conflicts**: Vite auto-switches ports - always check terminal for actual port (5173 → 5174)
- **Auth Issues**: Verify Supabase RLS policies, check `user?.role === "authenticated"` in context
- **QR Not Generating**: Ensure Supabase Storage bucket permissions are correct (public read access)

## Testing & Debugging
- No formal test suite currently (see [TESTING-GUIDE.md](../TESTING-GUIDE.md))
- Check browser console for Supabase errors (often auth or RLS policy issues)
- Use React DevTools to inspect `UrlContext` state
- Monitor Network tab for Supabase API calls (`.supabase.co` requests)

## Documentation References
- **Architecture**: [ARCHITECTURE.md](../ARCHITECTURE.md)
- **Setup**: [docs/setup.md](../docs/setup.md)
- **Deployment**: [DEPLOYMENT-GUIDE.md](../DEPLOYMENT-GUIDE.md)
- **Contributing**: [CONTRIBUTING.md](../CONTRIBUTING.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](../TROUBLESHOOTING.md)
