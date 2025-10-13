# 🚀 Deploy Backend to Railway

Write-Host "🎯 Deploying Backend to Railway..." -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue

if (-not $railwayInstalled) {
    Write-Host "⚠️ Railway CLI not found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Install it with:" -ForegroundColor White
    Write-Host "  npm install -g @railway/cli" -ForegroundColor Green
    Write-Host ""
    $install = Read-Host "Install Railway CLI now? (y/n)"
    
    if ($install -eq 'y') {
        Write-Host "Installing Railway CLI..." -ForegroundColor Cyan
        npm install -g @railway/cli
    } else {
        Write-Host "❌ Cannot deploy without Railway CLI" -ForegroundColor Red
        exit 1
    }
}

# Navigate to backend directory
Write-Host "📂 Navigating to backend directory..." -ForegroundColor Cyan
cd backend

# Login to Railway
Write-Host "🔐 Logging in to Railway..." -ForegroundColor Cyan
railway login

# Check if linked
Write-Host "🔗 Checking project link..." -ForegroundColor Cyan
$linked = railway status 2>&1

if ($linked -like "*not linked*") {
    Write-Host "⚠️ Not linked to a Railway project" -ForegroundColor Yellow
    Write-Host "Please link to your project:" -ForegroundColor White
    railway link
}

# Deploy
Write-Host "🚀 Deploying to Railway..." -ForegroundColor Cyan
Write-Host ""
railway up

Write-Host ""
Write-Host "✅ Deployment initiated!" -ForegroundColor Green
Write-Host ""
Write-Host "🔍 Check deployment status:" -ForegroundColor Cyan
Write-Host "   https://railway.app/dashboard" -ForegroundColor White
Write-Host ""
Write-Host "⏰ Deployment usually takes 2-3 minutes" -ForegroundColor Yellow
Write-Host ""

# Test endpoint after delay
$test = Read-Host "Wait and test endpoint? (y/n)"
if ($test -eq 'y') {
    Write-Host "Waiting 30 seconds for deployment..." -ForegroundColor Cyan
    Start-Sleep -Seconds 30
    
    Write-Host "Testing API..." -ForegroundColor Cyan
    try {
        $result = Invoke-WebRequest -Uri "https://sama-production-9e28.up.railway.app/api/health" -UseBasicParsing | ConvertFrom-Json
        Write-Host "✅ API is responding!" -ForegroundColor Green
        Write-Host "   Status: $($result.status)" -ForegroundColor White
        Write-Host "   Database: $($result.database)" -ForegroundColor White
    } catch {
        Write-Host "⚠️ API not ready yet. Check Railway dashboard." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✨ Done!" -ForegroundColor Green
