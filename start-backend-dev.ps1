# Start Backend Server for Development
Push-Location "c:\Users\croes\Desktop\sama\backend"
Write-Host "Starting MWG Hostels Backend Server..." -ForegroundColor Green
Write-Host "🔗 Server URL: http://localhost:5000" -ForegroundColor Cyan
Write-Host "📊 API Health: http://localhost:5000/api/health" -ForegroundColor Cyan
node simple-server.js
Pop-Location
