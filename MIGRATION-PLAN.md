# kliq.in - Complete Revamp Migration Plan

**From**: LOL URL (lolurl.site)  
**To**: kliq.in  
**Date**: December 29, 2025  
**Status**: 🚧 Planning Phase

---

## 🎯 Vision & Goals

Transform LOL URL into **kliq.in** - a modern, minimal URL shortener competing with dub.co, featuring:
- Advanced analytics with unique click tracking
- Workspace/team collaboration
- Payment integration for premium features
- Revenue tracking per link
- Minimal, clean design philosophy

---

## 📊 Architecture Changes

### Database Migration: Supabase → Prisma + Neon DB

**Current Stack:**
- Supabase (PostgreSQL + Auth + Storage)
- Direct SQL queries via Supabase client

**New Stack:**
- **Neon DB**: Serverless PostgreSQL
- **Prisma**: Type-safe ORM with migrations
- **Google Cloud Storage / Vercel Blob**: For QR codes and profile images

**Why this change?**
- Better type safety with Prisma
- More flexible schema management
- Neon's serverless architecture scales better
- Easier to implement complex queries for analytics

### Authentication Revamp

**Current:**
- Supabase Auth (email/password)

**New:**
- NextAuth.js / Auth.js with multiple providers:
  - Google OAuth (primary)
  - Email/Password (fallback)
  - GitHub OAuth (optional)

---

## 🗄️ New Database Schema

### Core Tables

#### `users`
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  accounts      Account[]
  sessions      Session[]
  workspaces    WorkspaceMember[]
  urls          Url[]
  invitations   Invitation[]
}
```

#### `workspaces` (NEW - Team Feature)
```prisma
model Workspace {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  logo        String?
  plan        Plan     @default(FREE)
  stripeId    String?  // For payment integration
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  members     WorkspaceMember[]
  urls        Url[]
  invitations Invitation[]
}

enum Plan {
  FREE
  PRO
  ENTERPRISE
}
```

#### `workspace_members` (NEW)
```prisma
model WorkspaceMember {
  id          String   @id @default(cuid())
  role        Role     @default(MEMBER)
  userId      String
  workspaceId String
  createdAt   DateTime @default(now())
  
  user        User      @relation(fields: [userId], references: [id])
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  
  @@unique([userId, workspaceId])
}

enum Role {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}
```

#### `urls` (ENHANCED)
```prisma
model Url {
  id           String    @id @default(cuid())
  originalUrl  String
  shortCode    String    @unique
  customSlug   String?   @unique
  qrCode       String?
  title        String?
  description  String?
  workspaceId  String?
  userId       String
  expiresAt    DateTime?
  password     String?   // For password-protected links
  disabled     Boolean   @default(false)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  user         User      @relation(fields: [userId], references: [id])
  workspace    Workspace? @relation(fields: [workspaceId], references: [id])
  clicks       Click[]
  revenue      Revenue[]
}
```

#### `clicks` (ENHANCED - Unique Tracking)
```prisma
model Click {
  id          String   @id @default(cuid())
  urlId       String
  timestamp   DateTime @default(now())
  
  // Device & Location
  country     String?
  city        String?
  device      String?
  browser     String?
  os          String?
  referer     String?
  
  // Unique tracking
  fingerprint String?  // Browser fingerprint
  ipHash      String?  // Hashed IP for privacy
  isUnique    Boolean  @default(true)
  
  url         Url      @relation(fields: [urlId], references: [id])
  
  @@index([urlId])
  @@index([fingerprint])
}
```

#### `invitations` (NEW)
```prisma
model Invitation {
  id          String   @id @default(cuid())
  email       String
  role        Role     @default(MEMBER)
  workspaceId String
  invitedBy   String
  token       String   @unique
  expiresAt   DateTime
  acceptedAt  DateTime?
  createdAt   DateTime @default(now())
  
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  inviter     User      @relation(fields: [invitedBy], references: [id])
}
```

#### `revenue` (NEW - Future Feature)
```prisma
model Revenue {
  id          String   @id @default(cuid())
  urlId       String
  amount      Float
  currency    String   @default("USD")
  source      String?  // e.g., "affiliate", "conversion"
  clickId     String?
  createdAt   DateTime @default(now())
  
  url         Url      @relation(fields: [urlId], references: [id])
}
```

---

## 🎨 Design Philosophy: Minimal & Clean

### Remove Heavy Components
**Components to Remove:**
- ❌ Spotlight effects
- ❌ Globe 3D animations
- ❌ VelocityScroll
- ❌ SparklesText
- ❌ Heavy Lottie animations
- ❌ Complex animated testimonials

**Keep Simple:**
- ✅ Clean cards with subtle shadows
- ✅ Simple hover states
- ✅ Smooth transitions (200-300ms)
- ✅ Minimal icons (Lucide)
- ✅ Typography-focused design

### Design Inspiration: dub.co
- Clean landing page with clear CTAs
- Dashboard with table-based link management
- Analytics with simple charts (Recharts)
- Minimal color palette (primary, muted, accent)

---

## 🚀 Migration Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Set up Neon DB project
- [ ] Initialize Prisma
- [ ] Create complete schema
- [ ] Set up NextAuth.js with Google OAuth
- [ ] Migrate environment variables

### Phase 2: Core Migration (Week 3-4)
- [ ] Migrate authentication system
- [ ] Migrate URL shortening logic
- [ ] Implement unique click tracking
- [ ] Migrate analytics components
- [ ] Test data migration scripts

### Phase 3: New Features (Week 5-6)
- [ ] Implement workspace system
- [ ] Build invitation flow
- [ ] Add workspace member management
- [ ] Create workspace settings page

### Phase 4: Design Overhaul (Week 7-8)
- [ ] Redesign landing page (minimal)
- [ ] Redesign dashboard (table-based)
- [ ] Simplify link creation flow
- [ ] Update analytics views
- [ ] Remove heavy animations

### Phase 5: Payment Integration (Week 9-10)
- [ ] Integrate Dodo Payments / Razorpay
- [ ] Create pricing page
- [ ] Implement subscription logic
- [ ] Add billing portal
- [ ] Revenue tracking UI

### Phase 6: Polish & Launch (Week 11-12)
- [ ] Performance optimization
- [ ] SEO optimization for kliq.in
- [ ] Domain migration
- [ ] Data migration from production
- [ ] Soft launch & testing

---

## 🔐 Environment Variables (New)

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..." # For Prisma migrations

# Auth
NEXTAUTH_URL="https://kliq.in"
NEXTAUTH_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Storage (Vercel Blob / GCS)
BLOB_READ_WRITE_TOKEN="..."

# Payment (Future)
RAZORPAY_KEY_ID="..."
RAZORPAY_SECRET="..."

# Analytics
NEXT_PUBLIC_DOMAIN="kliq.in"
```

---

## 📦 New Dependencies

```json
{
  "dependencies": {
    "@prisma/client": "^5.x",
    "next-auth": "^4.x",
    "@vercel/blob": "^0.x",
    "ua-parser-js": "^1.x",
    "fingerprintjs": "^4.x",
    "zod": "^3.x",
    "date-fns": "^3.x"
  },
  "devDependencies": {
    "prisma": "^5.x"
  }
}
```

**Remove:**
- `@supabase/supabase-js`
- Heavy animation libraries
- `react-qrcode-logo` (simplify QR generation)

---

## 🎯 Key Features Breakdown

### 1. Unique Clicks Tracking
**Implementation:**
- Generate browser fingerprint using FingerprintJS
- Hash IP addresses for privacy
- Store first click as unique, subsequent clicks from same fingerprint as non-unique
- Analytics show: Total Clicks vs Unique Clicks

### 2. Workspace System
**Features:**
- Create workspace with custom slug (e.g., `kliq.in/w/acme`)
- Invite team members via email
- Role-based permissions (Owner, Admin, Member, Viewer)
- Shared links under workspace
- Workspace-level analytics

### 3. Revenue Tracking
**Implementation:**
- Track conversions/sales through shortened links
- Manual revenue entry or API integration
- Dashboard showing revenue per link
- Export reports

---

## 🚨 Breaking Changes

### For Users
1. **Authentication**: Users will need to re-authenticate via Google OAuth
2. **URLs**: Existing short URLs will be migrated to new domain (lolurl.site → kliq.in)
3. **Analytics**: Historical data will be preserved but unique clicks will only track forward

### For Developers
1. **API**: All Supabase calls replaced with Prisma
2. **Auth Context**: New NextAuth-based context
3. **File Structure**: More organized with separate `/lib` folder for database operations

---

## 📝 Next Steps

1. **Review this plan** - Get feedback on scope and timeline
2. **Set up Neon DB** - Create project and get connection string
3. **Initialize Prisma** - Create schema.prisma with models above
4. **Branch strategy** - Work on `revamp` branch (already created ✅)
5. **Domain acquisition** - Secure kliq.in domain

---

## 💡 Future Enhancements (Post-Launch)

- A/B testing for links
- Custom domains for workspaces
- API for developers
- Webhooks for link events
- Link expiration with auto-delete
- Branded short domains
- Advanced analytics (funnel tracking, conversion rates)
- Integration with popular tools (Slack, Discord, etc.)

---

**Ready to start?** Let's begin with Phase 1: Setting up the foundation! 🚀
