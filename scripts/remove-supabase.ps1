# PowerShell script to remove Supabase dependencies from kliq.in
# Run this after verifying Prisma migration works

Write-Host "🗑️  Removing Supabase Dependencies..." -ForegroundColor Cyan
Write-Host ""

# 1. Remove old Supabase API files
Write-Host "📁 Removing old API files..." -ForegroundColor Yellow
Remove-Item -Path "src\db\supabase.js" -ErrorAction SilentlyContinue
Remove-Item -Path "src\db\apiAuth.js" -ErrorAction SilentlyContinue
Remove-Item -Path "src\db\apiUrls.js" -ErrorAction SilentlyContinue
Remove-Item -Path "src\db\apiClicks.js" -ErrorAction SilentlyContinue
Write-Host "✅ Old API files removed" -ForegroundColor Green
Write-Host ""

# 2. Uninstall Supabase package
Write-Host "📦 Uninstalling @supabase/supabase-js..." -ForegroundColor Yellow
npm uninstall @supabase/supabase-js
Write-Host "✅ Supabase package uninstalled" -ForegroundColor Green
Write-Host ""

# 3. Clean up old components
Write-Host "🧹 Removing old auth components..." -ForegroundColor Yellow
Remove-Item -Path "src\components\login.jsx" -ErrorAction SilentlyContinue
Remove-Item -Path "src\components\signup.jsx" -ErrorAction SilentlyContinue
Write-Host "✅ Old auth components removed" -ForegroundColor Green
Write-Host ""

# 4. Remove old assets
Write-Host "🖼️  Removing old profile assets..." -ForegroundColor Yellow
Remove-Item -Path "src\assets\profile_img.jpg" -ErrorAction SilentlyContinue
Write-Host "✅ Old assets removed" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 Supabase cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Old API files removed" -ForegroundColor Green
Write-Host "  ✅ Supabase package uninstalled" -ForegroundColor Green
Write-Host "  ✅ Old auth components removed" -ForegroundColor Green
Write-Host "  ✅ Old assets cleaned up" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Important: Run 'npm install' to update package-lock.json" -ForegroundColor Yellow
Write-Host "⚠️  Important: Test your app before deploying!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: npm install"
Write-Host "  2. Run: npm run dev"
Write-Host "  3. Test all features"
Write-Host "  4. Commit: git add . && git commit -m 'chore: remove Supabase dependencies'"
Write-Host ""
