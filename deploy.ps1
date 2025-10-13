# 🚀 Quick Deploy to Vercel

Write-Host "🎯 MWG Hostels - Deploying to Vercel..." -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git repository not initialized!" -ForegroundColor Red
    Write-Host "Run: git init" -ForegroundColor Yellow
    exit 1
}

# Check for uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "📝 Found changes to commit..." -ForegroundColor Yellow
    
    # Stage all files
    Write-Host "1️⃣ Staging files..." -ForegroundColor Cyan
    git add .
    
    # Commit with timestamp
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $commitMessage = "Update application system - $timestamp"
    Write-Host "2️⃣ Committing: $commitMessage" -ForegroundColor Cyan
    git commit -m $commitMessage
    
} else {
    Write-Host "✅ No changes to commit" -ForegroundColor Green
}

# Push to GitHub
Write-Host "3️⃣ Pushing to GitHub..." -ForegroundColor Cyan
try {
    git push origin master
    Write-Host "✅ Pushed to GitHub successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Push failed. Make sure you have a remote origin set up." -ForegroundColor Yellow
    Write-Host "Run: git remote add origin https://github.com/croesus245/sama.git" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Check your deployment:" -ForegroundColor Cyan
Write-Host "   Frontend: https://mwgbysama.vercel.app/" -ForegroundColor White
Write-Host ""
Write-Host "⏰ Vercel will auto-deploy in 1-2 minutes" -ForegroundColor Yellow
Write-Host ""

# Open Vercel in browser
$openBrowser = Read-Host "Open Vercel site in browser? (y/n)"
if ($openBrowser -eq 'y') {
    Start-Process "https://mwgbysama.vercel.app/"
}

Write-Host "✨ Done!" -ForegroundColor Green
