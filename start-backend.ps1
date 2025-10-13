# MWG Hostels - Start Backend Server
# This script starts the backend API server

Write-Host "🚀 Starting MWG Hostels Backend Server..." -ForegroundColor Cyan
Write-Host ""

# Change to backend directory
Set-Location "C:\Users\croes\Desktop\sama\backend"

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Start the server
Write-Host "✅ Starting server on port 5000..." -ForegroundColor Green
Write-Host "⚠️  Keep this window open while using the platform!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

node simple-server.js
