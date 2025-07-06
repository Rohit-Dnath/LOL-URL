# Troubleshooting Guide

If you encounter issues with LOL URL, try the following steps:

## 1. Installation Issues
- Ensure you have Node.js and npm installed.
- Run `npm install` to install dependencies.
- Delete `node_modules` and `package-lock.json`, then reinstall if problems persist.

## 2. Environment Variables
- Make sure your `.env` file is present and contains valid Supabase credentials.
- Restart the development server after changing environment variables.

## 3. Development Server Not Starting
- Check for errors in the terminal.
- Ensure no other process is using the same port (default: 3000 or 5000).

## 4. Build or Runtime Errors
- Review error messages in the browser and terminal.
- Check for missing or outdated dependencies.
- Run `npm run build` to test the production build.

## 5. Analytics or QR Code Issues
- Verify Supabase credentials and network connectivity.
- Check browser console for API errors.

## 6. Still Stuck?
- Search [GitHub Issues](https://github.com/Rohit-Dnath/LOL-URL/issues) for similar problems.
- Open a new issue with detailed steps to reproduce.
- Contact the maintainer at debnathrohit97@gmail.com.

Thank you for helping improve LOL URL!
