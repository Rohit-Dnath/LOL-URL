# MIGRATION-GUIDE

## Upgrading LOL URL

1. Pull the latest code from the main branch
2. Run `npm install` to update dependencies
3. Review the [RELEASE-NOTES.md](./RELEASE-NOTES.md) and [CHANGELOG.md](./CHANGELOG.md)
4. Update your `.env` file if new environment variables are required
5. Run `npm run build` and test the app

## Database Migrations
- Check for any Supabase schema changes in the release notes
- Apply migrations as described in the documentation

If you encounter issues, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
