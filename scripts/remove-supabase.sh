#!/bin/bash

# Script to remove Supabase dependencies from kliq.in
# Run this after verifying Prisma migration works

echo "🗑️  Removing Supabase Dependencies..."
echo ""

# 1. Remove old Supabase API files
echo "📁 Removing old API files..."
rm -f src/db/supabase.js
rm -f src/db/apiAuth.js
rm -f src/db/apiUrls.js
rm -f src/db/apiClicks.js
echo "✅ Old API files removed"
echo ""

# 2. Uninstall Supabase package
echo "📦 Uninstalling @supabase/supabase-js..."
npm uninstall @supabase/supabase-js
echo "✅ Supabase package uninstalled"
echo ""

# 3. Clean up old components (if they exist)
echo "🧹 Removing old auth components..."
rm -f src/components/login.jsx
rm -f src/components/signup.jsx
echo "✅ Old auth components removed"
echo ""

# 4. Remove old assets
echo "🖼️  Removing old profile assets..."
rm -f src/assets/profile_img.jpg
echo "✅ Old assets removed"
echo ""

# 5. Update .gitignore to exclude old Supabase files
echo "📝 Updating .gitignore..."
if ! grep -q "# Old Supabase files" .gitignore; then
  echo "" >> .gitignore
  echo "# Old Supabase files" >> .gitignore
  echo "src/db/supabase.js" >> .gitignore
fi
echo "✅ .gitignore updated"
echo ""

echo "🎉 Supabase cleanup complete!"
echo ""
echo "📋 Summary:"
echo "  ✅ Old API files removed"
echo "  ✅ Supabase package uninstalled"
echo "  ✅ Old auth components removed"
echo "  ✅ Old assets cleaned up"
echo ""
echo "⚠️  Important: Run 'npm install' to update package-lock.json"
echo "⚠️  Important: Test your app before deploying!"
echo ""
echo "Next steps:"
echo "  1. Run: npm install"
echo "  2. Run: npm run dev"
echo "  3. Test all features"
echo "  4. Commit: git add . && git commit -m 'chore: remove Supabase dependencies'"
echo ""
