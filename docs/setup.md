# Setup Guide

This guide will help you set up LOL URL for local development or production.

## Prerequisites
- Node.js (v18+ recommended)
- npm
- Supabase account (for database and auth)

## Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rohit-Dnath/LOL-URL.git
   cd LOL-URL
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials and other required values
4. **Start the development server:**
   ```bash
   npm run dev
   ```
5. **Access the app:**
   - Open [http://localhost:3000](http://localhost:3000) in your browser

For deployment, see [DEPLOYMENT-GUIDE.md](../DEPLOYMENT-GUIDE.md).

See [docs/database.md](./database.md) for database setup.
