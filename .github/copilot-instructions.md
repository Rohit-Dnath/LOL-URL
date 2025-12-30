# kliq.in - AI Coding Agent Instructions

## Project Overview
**kliq.in** is a minimal URL shortener competing with dub.co. Built with **React (Vite) + localStorage + Tailwind CSS** with planned **Prisma + Neon DB** migration. Features URL shortening, QR codes, click tracking, and Google OAuth.

> ⚠️ **CRITICAL**: Project is in TRANSITION state - uses **localStorage for data**, **NOT Prisma/Neon yet**. All `src/db/apiUrls.js` and `src/db/apiClicks.js` are mock implementations. Prisma schema exists but backend is NOT implemented. Don't assume database is functional.

## Architecture

### Current Tech Stack (What's ACTUALLY Running)
- **Frontend**: React 18, Vite, React Router v7, Tailwind CSS
- **Data Storage**: localStorage (NOT database yet!)
- **Auth**: Google OAuth via `@react-oauth/google` + localStorage sessions (NOT NextAuth)
- **QR Codes**: `react-qrcode-logo` library
- **Deployment**: Vercel (frontend only, no backend APIs deployed)

### Planned (NOT Implemented)
- ❌ Prisma ORM + Neon DB (schema exists, no backend)
- ❌ NextAuth.js (dependencies installed, not configured)
- ❌ Workspace/team features
- ❌ Backend server (server.js is empty)
- ❌ Revenue tracking

### Critical Data Flow Pattern
```
Component → src/db/apiUrls.js → localStorage
                                  ↓
                              Mock data returned
```

**NOT**:
```
Component → API → Prisma → Database  ❌ This doesn't exist
```

### Key Patterns

#### 1. Data Layer (src/db/) - MOCK IMPLEMENTATION ONLY
**Current Reality:**
- `src/db/apiUrls.js` - Mock functions using localStorage
- `src/db/apiClicks.js` - Mock functions using localStorage
- `src/lib/db/*.js` - Prisma helpers exist but UNUSED (no backend server)
- `src/db/apiUrlsPrisma.js` - Intended Prisma implementations (not integrated)

**Example - How it actually works:**
```javascript
// src/db/apiUrls.js
export async function createUrl({ title, longUrl, customUrl, user_id }, qrcode) {
  // Saves to localStorage, NOT database
  const urls = JSON.parse(localStorage.getItem(`urls_${user_id}`) || '[]');
  const newUrl = { id: nanoid(), title, original_url: longUrl, ... };
  urls.push(newUrl);
  localStorage.setItem(`urls_${user_id}`, JSON.stringify(urls));
  return [newUrl];
}
```

**When implementing backend:**
1. Replace localStorage calls in `src/db/apiUrls.js` with fetch to API routes
2. Create API endpoints (e.g., `/api/urls`) that use Prisma
3. Update all components (they already import from `@/db/apiUrls`)

#### 2. Authentication - Custom Google OAuth (NOT NextAuth)
**Location:** `src/lib/auth/google-auth.jsx`

**Pattern:**
```javascript
import { useSession, useAuth } from '@/lib/auth/google-auth.jsx';

function Component() {
  const { session, status, signIn, signOut } = useSession();
  const user = session?.user; // { email, name, picture, sub }
  const isAuthenticated = status === 'authenticated';
}
```

**Session Storage:** localStorage key `kliqin_session`
```json
{
  "user": { "email": "...", "name": "...", "picture": "...", "sub": "..." },
  "expiresAt": 1735567890000
}
```

**NOT NextAuth:** Despite dependencies, NextAuth is not configured. Auth logic is custom.

#### 3. Component Structure
- **Pages**: `src/pages/` (landing, dashboard, auth, link, redirect-link)
- **Shared Components**: `src/components/` (create-link, link-card, location-stats, device-stats)
- **UI Components**: `src/components/ui/` (shadcn/ui - button, dialog, input, etc.)
- **Layouts**: `src/layouts/app-layout.jsx` (contains Header, handles navigation)

**Import Alias**: Use `@/` for src imports (configured in vite.config.js)

#### 4. Routing (React Router v7)
Defined in `src/App.jsx` with `createBrowserRouter`:
```javascript
{
  path: "/:id",
  element: <RedirectHandler />,  // Handles short URL redirects
},
{
  element: <AppLayout />,
  children: [
    { path: "/", element: <LandingPage /> },
    { path: "/dashboard", element: <RequireAuth><Dashboard /></RequireAuth> },
    { path: "/link/:id", element: <RequireAuth><Link /></RequireAuth> },
  ]
}
```

**Key Route:** `/:id` - Catches ALL short URLs (e.g., `/abc123`) before other routes
**Protection:** `RequireAuth` component checks localStorage session

## Development Workflow

### Running Locally
```bash
npm run dev        # Standard dev server (Vite only, port 5173)
npm run chala      # Alias for dev (cultural preference, don't remove)
npm run build      # Production build
npm run preview    # Preview production build
```
Dev server runs on `http://localhost:5173` (Vite default, NOT 3000)

**IMPORTANT:** Only frontend runs locally. No backend server. Data persists in browser localStorage.

### Environment Variables
Required in `.env`:
```env
# Auth (ONLY these are actually used)
VITE_GOOGLE_CLIENT_ID="...apps.googleusercontent.com"
VITE_APP_URL="http://localhost:5173"
```

**Critical:** All client-accessible env vars MUST use `VITE_` prefix (Vite requirement)

**Unused (planned for future):**
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXTAUTH_URL="..."
NEXTAUTH_SECRET="..."
```

### Prisma Commands (NON-FUNCTIONAL)
These exist but don't affect running app:
```bash
npm run db:push       # Would push schema to Neon DB (not connected)
npm run db:studio     # Would open Prisma Studio (not connected)
npm run db:generate   # Generates Prisma Client (unused)
```

## Code Conventions

### Styling
- Use Tailwind utility classes (no inline styles or CSS modules)
- UI components follow shadcn/ui patterns with `cn()` utility ([src/lib/utils.js](../src/lib/utils.js))
- Toast notifications: Use `react-toastify` with config from [src/utils/toastConfig.js](../src/utils/toastConfig.js)
- Theme: Dark mode preferred, uses CSS variables defined in [src/index.css](../src/index.css)
- **Minimal animations**: Only use subtle hover states, smooth transitions (200-300ms)

### Error Handling
```jsx
// Standard pattern in components:
if (error) return <Error message={error.message} />;
if (loading) return <BeatLoader />; // from react-spinners
```

### Form Validation
- Use `yup` for schema validation (legacy, consider migrating to zod)
- Display errors via `<Error>` component with field-specific messages
- Example:
```javascript
const schema = yup.object().shape({
  title: yup.string().required("Title required"),
  longUrl: yup.string().url("Invalid URL").required("Long URL is required"),
  customUrl: yup.string().optional()
});
```

### QR Code Generation
- Use `react-qrcode-logo` library (already integrated)
- QR codes stored as base64 in localStorage
- Generate during URL creation in create-link.jsx
- Download handled by browser `canvas.toDataURL()` method

## Important Implementation Details

### URL Shortening Logic
1. Generate random short code: `Math.random().toString(36).substring(2, 7)` (5 chars)
2. Custom slugs optional - validate format (lowercase, alphanumeric, hyphens)
3. Check uniqueness: Loop through localStorage data OR use `checkCustomUrlExists()`
4. Store in localStorage: `localStorage.setItem(`urls_${user_id}`, JSON.stringify(urls))`
5. URL format: `${window.location.origin}/${shortCode}`

### Click Tracking (Current Mock Implementation)
1. Client calls `storeClicks()` from `src/db/apiClicks.js`
2. Saves to localStorage: `clicks_${url_id}`
3. Location data from IP geolocation API (if integrated)
4. Device/browser from User-Agent string
5. No fingerprinting or unique tracking yet (planned for Prisma migration)

### Data Persistence
**localStorage Keys:**
- `kliqin_session` - User auth session
- `urls_${user_id}` - User's URLs array
- `clicks_${url_id}` - Click data for specific URL

**Data Structure Example:**
```javascript
// urls_sub123
[
  {
    id: "abc123",
    title: "My Link",
    original_url: "https://example.com",
    short_url: "xyz456",
    custom_url: "mylink",
    qr: "data:image/png;base64,...",
    user_id: "sub123",
    created_at: "2025-12-30T..."
  }
]
```

## Common Tasks

### Adding New Features (Frontend Only)
1. Create component in `src/components/` or page in `src/pages/`
2. Use existing data layer: import from `@/db/apiUrls` or `@/db/apiClicks`
3. Data persists to localStorage automatically
4. Use shadcn/ui components for consistency
5. Follow Tailwind + minimal design patterns

### Modifying Data Layer (Preparation for Backend)
1. Keep function signatures in `src/db/apiUrls.js` unchanged
2. Components depend on these interfaces
3. When backend ready: replace localStorage with fetch calls
4. Prisma implementations already exist in `src/db/apiUrlsPrisma.js` (reference only)

### Creating New UI Components
1. Use shadcn/ui components from [src/components/ui/](../src/components/ui/)
2. Keep design minimal - no heavy animations
3. Use consistent spacing: `p-4`, `gap-4`, `rounded-lg`
4. Stick to neutral color palette

### Adding New Routes
1. Add route to [src/App.jsx](../src/App.jsx)
2. Use custom auth check: `<RequireAuth>` wrapper
3. Include meta tags for SEO (inline in JSX)

## Testing & Debugging
- No formal test suite currently (see [TESTING-GUIDE.md](../TESTING-GUIDE.md))
- Test in browser: Check localStorage in DevTools → Application → Local Storage
- Auth: Session stored at key `kliqin_session`
- URLs: Check `urls_${user.sub}` key
- Verify Google OAuth: Check console for auth errors

## Documentation References
- **Migration Plan**: [MIGRATION-PLAN.md](../MIGRATION-PLAN.md) - Complete revamp details
- **Architecture**: [ARCHITECTURE.md](../ARCHITECTURE.md)
- **Setup**: [docs/setup.md](../docs/setup.md)
- **Deployment**: [DEPLOYMENT-GUIDE.md](../DEPLOYMENT-GUIDE.md)
- **Contributing**: [CONTRIBUTING.md](../CONTRIBUTING.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](../TROUBLESHOOTING.md)
