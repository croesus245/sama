#!/bin/bash
# Railway Deployment Script for MWG Hostels Backend

echo "🚂 Preparing Railway Deployment..."
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository"
    echo "Please run this from your backend directory"
    exit 1
fi

# Check if files exist
echo "✅ Checking deployment files..."
if [ -f "railway.json" ]; then
    echo "  ✓ railway.json found"
else
    echo "  ✗ railway.json missing"
fi

if [ -f "nixpacks.toml" ]; then
    echo "  ✓ nixpacks.toml found"
else
    echo "  ✗ nixpacks.toml missing"
fi

if [ -f "Procfile" ]; then
    echo "  ✓ Procfile found"
else
    echo "  ✗ Procfile missing"
fi

echo ""
echo "📦 Files ready for Railway deployment!"
echo ""
echo "🔗 Next steps:"
echo "1. Go to https://railway.app"
echo "2. Login with GitHub"
echo "3. Create new project from GitHub repo: croesus245/sama"
echo "4. Set root directory to: backend"
echo "5. Add environment variables (see RAILWAY-DEPLOYMENT-GUIDE.md)"
echo ""
echo "✨ Railway will automatically deploy your backend!"
