# 🚨 IMPORTANT: Migration in Progress

## Current State (Dec 29, 2025)

KliqIN is currently migrating from Supabase to **Google OAuth + Prisma + Neon DB**.

### ✅ What's Implemented
- ✅ Google OAuth authentication with `@react-oauth/google`
- ✅ Session management via localStorage
- ✅ Complete UI redesign (minimal, clean aesthetic)
- ✅ Removed all Supabase dependencies

### 🚧 What's Temporary (Mock Data)
- ⚠️ URL storage uses **localStorage** (temporary)
- ⚠️ Click analytics uses **localStorage** (temporary)
- ⚠️ No backend database yet

### 🔜 What's Next
1. Set up Prisma + Neon DB backend
2. Create REST/GraphQL API endpoints
3. Migrate data from localStorage to real database
4. Add proper session management with HTTP-only cookies
5. Implement workspace/team features

## 📖 Setup Instructions

See **[GOOGLE-OAUTH-SETUP.md](GOOGLE-OAUTH-SETUP.md)** for complete setup guide.

**Quick start:**
```bash
# 1. Copy example env
cp .env.example .env

# 2. Add your Google OAuth Client ID to .env
VITE_GOOGLE_CLIENT_ID=your_client_id_here

# 3. Install and run
npm install
npm run dev
```

## 📚 Documentation

- **[GOOGLE-OAUTH-SETUP.md](GOOGLE-OAUTH-SETUP.md)** - Auth setup guide
- **[MIGRATION-PLAN.md](MIGRATION-PLAN.md)** - Complete migration roadmap
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute

## ⚠️ Known Limitations

Since we're using mock localStorage APIs:
- Data doesn't persist across browsers/devices
- No real-time sync
- Limited to browser storage limits
- No server-side validation
- No workspace collaboration yet

These are **temporary** and will be resolved once the backend is implemented.

## 🤝 Contributing

We're actively working on the backend migration! Check [MIGRATION-PLAN.md](MIGRATION-PLAN.md) for areas where you can help.

---

**Built with ❤️ by [Rohit Debnath](https://rohitdebnath.me)**
