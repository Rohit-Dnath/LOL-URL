# Google OAuth Configuration Guide

## ✅ Configuration Complete in Code

Google OAuth has been successfully integrated into your LOL URL application!

## 🔧 Google Cloud Console Setup Required

You need to add these URLs to your Google Cloud Console project:

### **Authorized JavaScript Origins**
Add these URLs in Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client IDs:

```
http://localhost:5173
https://lolurl.site
https://mnxljlnsoezmrhzzjrfy.supabase.co
```

### **Authorized Redirect URIs**
Add these URLs in the same section (CRITICAL - all must be added):

```
http://localhost:5173/dashboard
https://lolurl.site/dashboard
https://mnxljlnsoezmrhzzjrfy.supabase.co/auth/v1/callback
```

## 📋 Steps to Configure in Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project

2. **Navigate to Credentials**
   - Click "APIs & Services" → "Credentials"
   - Find your OAuth 2.0 Client ID (from your Google Cloud Console)

3. **Edit OAuth Client**
   - Click on your Client ID
   - Scroll to "Authorized JavaScript origins"
   - Click "+ ADD URI" and add both origins above
   - Scroll to "Authorized redirect URIs"
   - Click "+ ADD URI" and add all three redirect URIs above
   - Click "SAVE"

## 🔐 Supabase Configuration

You also need to configure Google OAuth in Supabase:

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com/
   - Select your project

2. **Enable Google Provider**
   - Go to Authentication → Providers
   - Find "Google" and click to expand
   - Toggle "Enable Sign in with Google"
   - Enter your Google OAuth credentials (Client ID and Secret from Google Cloud Console)
   - Click "Save"

## 🎯 Features Implemented

✅ **Login Component**
- Added "Continue with Google" button
- Maintains existing email/password login
- Styled with Google brand colors

✅ **Signup Component**
- Added "Sign up with Google" button
- Maintains existing email/password signup
- Styled with Google brand colors

✅ **Google Avatar Support**
- When users sign in with Google, their Google profile picture is automatically used
- Supabase stores this in `user.user_metadata.avatar_url`
- Access it via: `user.user_metadata.avatar_url` or `user.user_metadata.picture`

✅ **Environment Variables**
- Added `VITE_GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_SECRET` to `.env`

## 🚀 How It Works

1. **User clicks "Continue with Google"**
2. **Redirects to Google OAuth consent screen**
3. **User authorizes the app**
4. **Google redirects back to your app** with auth code
5. **Supabase exchanges code for tokens**
6. **User is authenticated and redirected to dashboard**
7. **Google avatar is automatically saved to user metadata**

## 📝 Accessing User Data

After Google login, user data is available:

```javascript
const user = UrlState().user;

// User profile info
const name = user.user_metadata.full_name || user.user_metadata.name;
const email = user.email;
const avatar = user.user_metadata.avatar_url || user.user_metadata.picture;

// Check if user signed in with Google
const provider = user.app_metadata.provider; // will be "google"
```

## 🔄 Next Steps

1. Configure Google Cloud Console (add URLs above)
2. Configure Supabase Authentication (enable Google provider)
3. Restart your dev server: `npm run dev`
4. Test the Google login flow!

## 🐛 Troubleshooting

**Issue**: "redirect_uri_mismatch" error
- **Solution**: Make sure all redirect URIs are added to Google Cloud Console exactly as shown above

**Issue**: "Provider not enabled"
- **Solution**: Enable Google provider in Supabase Dashboard (Authentication → Providers)

**Issue**: Google avatar not showing
- **Solution**: Access `user.user_metadata.avatar_url` instead of `user.user_metadata.profile_pic`

## 📚 Code Files Modified

- `.env` - Added Google credentials
- `src/db/apiAuth.js` - Added `loginWithGoogle()` function
- `src/components/login.jsx` - Added Google login button
- `src/components/signup.jsx` - Added Google signup button

---

**Created**: January 26, 2026
**Status**: ✅ Ready to configure
