# Google OAuth Setup Guide

## 🚀 Quick Setup

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen:
   - User Type: External
   - App name: KliqIN
   - User support email: Your email
   - Developer contact: Your email
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: KliqIN Web Client
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - `https://your-production-domain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:5173` (for development)
     - `https://your-production-domain.com` (for production)

### 2. Configure Environment Variables

Create a `.env` file in your project root:

```env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
VITE_APP_URL=http://localhost:5173
```

Replace `YOUR_CLIENT_ID_HERE` with the Client ID from Google Cloud Console.

### 3. Run the App

```bash
npm install
npm run dev
```

The app will run on `http://localhost:5173`

## 🔒 Security Notes

- **Never commit your `.env` file** to version control
- Keep your Client ID safe but note it's not a secret (it's visible in browser)
- For production, use environment variables in your hosting platform (Vercel, Netlify, etc.)

## 📝 Production Deployment

### Vercel

1. Add environment variable in Vercel dashboard:
   - Key: `VITE_GOOGLE_CLIENT_ID`
   - Value: Your Google Client ID
2. Update authorized origins/redirect URIs in Google Console with your production domain

### Other Platforms

Add the `VITE_GOOGLE_CLIENT_ID` environment variable in your hosting platform's settings.

## 🐛 Troubleshooting

### "Google OAuth Not Configured" message
- Ensure `VITE_GOOGLE_CLIENT_ID` is set in your `.env` file
- Restart the dev server after adding env vars

### "redirect_uri_mismatch" error
- Make sure your local URL (`http://localhost:5173`) is added to authorized redirect URIs in Google Console
- Check that you're not using `https` locally unless configured

### Authentication not persisting
- Check browser localStorage for `kliqin_session`
- Clear localStorage and try signing in again

## 🎯 Next Steps

This is using localStorage for sessions (temporary solution). For production:
1. Set up a backend API with Prisma + Neon DB
2. Implement proper session management with HTTP-only cookies
3. Add refresh token logic for long-lived sessions
4. Replace mock data APIs with real database calls

See `MIGRATION-PLAN.md` for the full roadmap to Prisma/Neon DB migration.
