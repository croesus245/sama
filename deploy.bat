@echo off
echo 🚀 MWG Hostels - Quick Deploy Script
echo =====================================
echo.

echo 📋 Step 1: Checking for Vercel CLI...
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not found!
    echo 📥 Installing Vercel CLI...
    npm install -g vercel
    echo ✅ Vercel CLI installed!
) else (
    echo ✅ Vercel CLI found!
)

echo.
echo 📋 Step 2: Preparing deployment...
echo 🔍 Current directory: %cd%
echo 📁 Files to deploy:
dir /b *.html *.js *.css *.json *.png *.jpg

echo.
echo 📋 Step 3: Starting deployment...
echo 🚀 Deploying to Vercel...
vercel --prod

echo.
echo ✅ Deployment complete!
echo 🌐 Your site should be live at: https://sama-ruddy.vercel.app/
echo.
echo 📋 Next steps:
echo 1. Open https://sama-ruddy.vercel.app/realtor-login.html
echo 2. Login with: admin@mwghostels.com / sama2024
echo 3. Add hostels using the improved form
echo 4. Hostels will now persist on the live site!
echo.
pause