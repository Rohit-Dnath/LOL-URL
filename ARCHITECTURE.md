# ARCHITECTURE

## Overview
LOL URL is a modern web application built with React (Vite), Tailwind CSS, and Supabase for backend services.

## Key Components
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Supabase (auth, database, analytics)
- **Deployment:** Vercel

## Folder Structure
- `src/` — Main source code
- `public/` — Static assets
- `README.md` — Project overview

## Data Flow
1. User submits a long URL
2. Frontend sends request to Supabase
3. Supabase returns short URL and analytics

See the codebase and [GLOSSARY.md](./GLOSSARY.md) for more details.
