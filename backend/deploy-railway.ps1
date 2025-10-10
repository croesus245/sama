# Railway Deployment Script for MWG Hostels Backend
# Run this to prepare for deployment

Write-Host "🚂 Preparing Railway Deployment..." -ForegroundColor Cyan
Write-Host ""

# Check if in correct directory
if (!(Test-Path "simple-server.js")) {
    Write-Host "❌ Error: simple-server.js not found" -ForegroundColor Red
    Write-Host "Please run this from the backend directory" -ForegroundColor Yellow
    exit 1
}

# Check deployment files
Write-Host "✅ Checking deployment files..." -ForegroundColor Green

$files = @("railway.json", "nixpacks.toml", "Procfile", ".railwayignore")
$allPresent = $true

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file found" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file missing" -ForegroundColor Red
        $allPresent = $false
    }
}

Write-Host ""

if ($allPresent) {
    Write-Host "📦 All files ready for Railway deployment!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Some files are missing!" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🔗 Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to https://railway.app" -ForegroundColor White
Write-Host "2. Login with your GitHub account" -ForegroundColor White
Write-Host "3. Click 'New Project' → 'Deploy from GitHub repo'" -ForegroundColor White
Write-Host "4. Select repository: croesus245/sama" -ForegroundColor White
Write-Host "5. Set root directory to: backend" -ForegroundColor White
Write-Host "6. Add environment variables (see RAILWAY-DEPLOYMENT-GUIDE.md)" -ForegroundColor White
Write-Host ""
Write-Host "✨ Railway will automatically detect and deploy your backend!" -ForegroundColor Magenta
Write-Host ""
Write-Host "📚 For detailed instructions, read: RAILWAY-DEPLOYMENT-GUIDE.md" -ForegroundColor Yellow
