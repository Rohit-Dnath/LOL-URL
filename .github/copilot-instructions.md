# kliq.in - AI Coding Agent Instructions

## Project Overview
**kliq.in** is a minimal, powerful URL shortener competing with dub.co. Built with **React (Vite) + Prisma + Neon DB + Tailwind CSS**. Features include URL shortening, QR codes, advanced analytics with unique click tracking, workspace/team collaboration, and revenue tracking.

> 🚧 **MIGRATION IN PROGRESS**: Transitioning from LOL URL (Supabase) to kliq.in (Prisma + Neon DB). See [MIGRATION-PLAN.md](../MIGRATION-PLAN.md) for complete details.

## Architecture

### Tech Stack (NEW)
- **Frontend**: React 18, Vite, React Router v7, Tailwind CSS (minimal design)
- **Backend**: Prisma ORM + Neon DB (Serverless PostgreSQL)
- **Auth**: NextAuth.js / Auth.js with Google OAuth (primary), email/password (fallback)
- **Storage**: Vercel Blob / Google Cloud Storage (QR codes, profile pics)
- **Payments**: Dodo Payments / Razorpay (future feature)
- **Deployment**: Vercel
- **Styling**: Minimal Tailwind design system - NO heavy animations

### Design Philosophy
**Minimal & Clean** - Inspired by dub.co
- ✅ Simple cards, subtle shadows, smooth transitions
- ✅ Typography-focused, clean layouts
- ✅ Lucide icons only
- ❌ NO Spotlight, Globe, VelocityScroll, SparklesText, Lottie animations
- ❌ NO heavy decorative components

### Key Patterns

#### 1. Database Access Layer (`lib/db/` - NEW LOCATION)
All database operations use Prisma Client:
- `lib/db/prisma.ts` - Singleton Prisma client instance
- `lib/db/users.ts` - User CRUD operations
- `lib/db/urls.ts` - URL CRUD with workspace support
- `lib/db/clicks.ts` - Analytics with unique tracking
- `lib/db/workspaces.ts` - Workspace and member management
- `lib/db/invitations.ts` - Invitation system

**Pattern**: Use Prisma's type-safe queries. Never write raw SQL unless absolutely necessary.

```typescript
// Example: Creating a URL with workspace
const url = await prisma.url.create({
  data: {
    originalUrl: longUrl,
    shortCode: generateShortCode(),
    userId: user.id,
    workspaceId: workspace?.id,
  },
  include: { clicks: true, workspace: true }
});
```

#### 2. Authentication (`next-auth` / `auth.js`)
- Primary: Google OAuth
- Fallback: Email/Password
- Session management via NextAuth
- Protected routes use middleware or `getServerSession()`

**Pattern**: Always check session server-side for protected pages
```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const session = await getServerSession(authOptions);
if (!session) redirect("/login");
```

#### 3. Unique Click Tracking
Uses browser fingerprinting + IP hashing for privacy-focused unique visitor tracking:

```typescript
import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Generate fingerprint on client
const fp = await FingerprintJS.load();
const result = await fp.get();
const fingerprint = result.visitorId;

// Store click with uniqueness check
const existingClick = await prisma.click.findFirst({
  where: { urlId, fingerprint }
});

await prisma.click.create({
  data: {
    urlId,
    fingerprint,
    ipHash: hashIP(req.ip),
    isUnique: !existingClick,
    // ... other fields
  }
});
```

**Key**: First click from a fingerprint = unique, subsequent = non-unique

#### 4. Workspace System
Multi-tenant workspace architecture with role-based access:

```typescript
// Get user's workspaces
const workspaces = await prisma.workspaceMember.findMany({
  where: { userId: session.user.id },
  include: { workspace: true }
});

// Check permissions
async function hasPermission(userId: string, workspaceId: string, action: string) {
  const member = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } }
  });
  
  // OWNER and ADMIN can edit, MEMBER can view/create, VIEWER only views
  const permissions = {
    OWNER: ['read', 'write', 'delete', 'invite', 'billing'],
    ADMIN: ['read', 'write', 'delete', 'invite'],
    MEMBER: ['read', 'write'],
    VIEWER: ['read']
  };
  
  return permissions[member.role]?.includes(action) ?? false;
}
```

**Invitation Flow**:
1. Admin sends invite → creates `Invitation` record with token
2. Email sent with magic link
3. User clicks link → verifies token → added to workspace

#### 5. Component Structure
- **Pages**: [src/pages/](../src/pages/) (landing, dashboard, auth, link, redirect-link)
- **Shared Components**: [src/components/](../src/components/) (create-link, link-card, location-stats, device-stats)
- **UI Components**: [src/components/ui/](../src/components/ui/) (shadcn/ui - button, dialog, input, etc.)
- **Layouts**: [src/layouts/app-layout.jsx](../src/layouts/app-layout.jsx) (contains Header, handles navigation)

**Import Alias**: Use `@/` for src imports (configured in [vite.config.js](../vite.config.js))

**Landing Page Pattern**: [landing.jsx](../src/pages/landing.jsx) - SIMPLIFIED for minimal design:
- Remove: Spotlight, Globe, VelocityScroll, SparklesText animations
- Keep: Simple hero section, feature cards, testimonials (static), CTA buttons
- Modal state for Privacy/Terms remains but simplified styling

#### 6. Routing (React Router v7)
- Defined in [src/App.jsx](../src/App.jsx) with `createBrowserRouter`
- Protected routes use NextAuth middleware or client-side session checks
- Custom URL redirects handled by [redirect-link.jsx](../src/pages/redirect-link.jsx)

#### 7. Layout & Branding
- Clean header with workspace switcher dropdown
- User menu with workspace settings, billing (if owner), logout
- Footer: "Made by Rohit" (simplified, no GIF)
- Logo: Minimal "kliq" wordmark
- Color scheme: Neutral grays with accent color (e.g., blue)

## Development Workflow

### Running Locally
```bash
npm run dev        # Standard dev server
npm run chala      # Alias for dev (cultural preference, don't remove)
npm run build      # Production build
npm run preview    # Preview production build
```
Dev server runs on `http://localhost:5173` (Vite default, NOT 3000)

### Environment Variables
Required in `.env`:
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..." # For Prisma migrations

# Auth
NEXTAUTH_URL="http://localhost:5173"
NEXTAUTH_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Storage
BLOB_READ_WRITE_TOKEN="..." # Vercel Blob

# Analytics
NEXT_PUBLIC_DOMAIN="kliq.in"
```
**Critical**: All client-accessible env vars must be prefixed with `VITE_` or `NEXT_PUBLIC_`

### Database Schema
See [MIGRATION-PLAN.md](../MIGRATION-PLAN.md) for complete Prisma schema. Key models:
- `User` - Auth users with NextAuth fields
- `Workspace` - Team/organization container
- `WorkspaceMember` - User-workspace relationship with roles
- `Url` - Shortened URLs with workspace support
- `Click` - Analytics with unique tracking (fingerprint, ipHash, isUnique)
- `Invitation` - Workspace invites with tokens
- `Revenue` - Revenue tracking per URL (future)

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
- Use `zod` for schema validation (replacing yup)
- Display errors via `<Error>` component with field-specific messages
- Example:
```typescript
const urlSchema = z.object({
  title: z.string().min(1, "Title required"),
  originalUrl: z.string().url("Invalid URL"),
  customSlug: z.string().optional()
});
```

### QR Code Generation
- Use `qrcode` library (simpler than react-qrcode-logo)
- QR codes stored in Vercel Blob Storage
- Basic customization: colors, size (keep minimal)
- No complex logos or heavy styling

## Important Implementation Details

### URL Shortening Logic
1. Generate random short code: `nanoid(6)` (better than Math.random)
2. Custom slugs optional - validate format (lowercase, alphanumeric, hyphens)
3. Check uniqueness: `await prisma.url.findUnique({ where: { shortCode } })`
4. Store in database with user/workspace association
5. URL format: `kliq.in/{shortCode}`

### Unique Click Tracking
1. Client generates fingerprint using FingerprintJS
2. Server receives: fingerprint + IP address
3. Hash IP for privacy: `crypto.createHash('sha256').update(ip).digest('hex')`
4. Check if fingerprint exists for this URL
5. Mark as unique only if first occurrence
6. Analytics show: **Total Clicks** (all) vs **Unique Clicks** (deduplicated)

### Workspace Management
**Creating Workspace:**
```typescript
const workspace = await prisma.workspace.create({
  data: {
    name: "Acme Inc",
    slug: "acme",
    members: {
      create: {
        userId: session.user.id,
        role: "OWNER"
      }
    }
  }
});
```

**Inviting Members:**
```typescript
const token = nanoid(32);
const invitation = await prisma.invitation.create({
  data: {
    email: inviteEmail,
    workspaceId,
    invitedBy: session.user.id,
    role: "MEMBER",
    token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }
});
// Send email with link: kliq.in/invite/{token}
```

## Common Tasks

### Adding New DB Operations
1. Add function to appropriate `lib/db/*.ts` file
2. Use Prisma queries with proper error handling
3. Return type-safe results with `include` for relations
```typescript
async function getUrlWithAnalytics(shortCode: string) {
  return await prisma.url.findUnique({
    where: { shortCode },
    include: {
      clicks: { orderBy: { timestamp: 'desc' }, take: 100 },
      workspace: true,
      user: { select: { name: true, email: true } }
    }
  });
}
```

### Creating New UI Components
1. Use shadcn/ui components from [src/components/ui/](../src/components/ui/)
2. Keep design minimal - no heavy animations
3. Use consistent spacing: `p-4`, `gap-4`, `rounded-lg`
4. Stick to neutral color palette

### Adding New Routes
1. Add route to [src/App.jsx](../src/App.jsx)
2. Use NextAuth session check for protected routes
3. Include meta tags for SEO

## Testing & Debugging
- No formal test suite currently (see [TESTING-GUIDE.md](../TESTING-GUIDE.md))
- Use Prisma Studio for database inspection: `npx prisma studio`
- Check browser console for API errors
- Verify NextAuth session: `/api/auth/session`

## Documentation References
- **Migration Plan**: [MIGRATION-PLAN.md](../MIGRATION-PLAN.md) - Complete revamp details
- **Architecture**: [ARCHITECTURE.md](../ARCHITECTURE.md)
- **Setup**: [docs/setup.md](../docs/setup.md)
- **Deployment**: [DEPLOYMENT-GUIDE.md](../DEPLOYMENT-GUIDE.md)
- **Contributing**: [CONTRIBUTING.md](../CONTRIBUTING.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](../TROUBLESHOOTING.md)
