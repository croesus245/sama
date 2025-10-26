# ============================================================================
# BACKEND DEPLOYMENT VERIFICATION SCRIPT (PowerShell)
# ============================================================================
# This script verifies that the MWG Hostels backend is properly deployed
# to Railway and accessible from the internet
# ============================================================================

Write-Host "🚀 MWG HOSTELS - BACKEND DEPLOYMENT VERIFICATION" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

$BACKEND_URL = "https://sama-production-9e28.up.railway.app"
$API_URL = "$BACKEND_URL/api"
$HEALTH_ENDPOINT = "$API_URL/health"

# Test 1: Check API Health Endpoint
Write-Host "[TEST 1] Checking if API is accessible..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri $HEALTH_ENDPOINT -Method Get -TimeoutSec 10 -ErrorAction Stop
    $HTTP_CODE = $response.StatusCode
    $BODY = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ SUCCESS: API is responding (HTTP $HTTP_CODE)" -ForegroundColor Green
    Write-Host "Response: $($BODY | ConvertTo-Json -Depth 2)" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED: API returned error" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "⚠️  ACTION REQUIRED:" -ForegroundColor Yellow
    Write-Host "  1. Go to https://railway.app/dashboard" -ForegroundColor Yellow
    Write-Host "  2. Find 'sama-production' project" -ForegroundColor Yellow
    Write-Host "  3. Check if service is Running (green)" -ForegroundColor Yellow
    Write-Host "  4. Click 'Deploy' if it's stopped" -ForegroundColor Yellow
    Write-Host "  5. Wait 2-3 minutes and try again" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Test 2: Check Database Connection
Write-Host "[TEST 2] Checking database connectivity..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "$API_URL/hostels" -Method Get -TimeoutSec 10 -ErrorAction Stop
    $HTTP_CODE = $response.StatusCode
    Write-Host "✅ SUCCESS: Database is connected (HTTP $HTTP_CODE)" -ForegroundColor Green
    Write-Host "API returned hostels data successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED: Database query failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "⚠️  ACTION REQUIRED:" -ForegroundColor Yellow
    Write-Host "  1. Check MongoDB Atlas at https://cloud.mongodb.com" -ForegroundColor Yellow
    Write-Host "  2. Verify connection string is correct in Railway env vars" -ForegroundColor Yellow
    Write-Host "  3. Check if MongoDB cluster is running" -ForegroundColor Yellow
    Write-Host "  4. Verify MONGODB_URI is set in Railway dashboard" -ForegroundColor Yellow
}

Write-Host ""

# Test 3: Response Time
Write-Host "[TEST 3] Checking API response time..." -ForegroundColor Blue
$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
try {
    $response = Invoke-WebRequest -Uri $HEALTH_ENDPOINT -Method Get -TimeoutSec 10 -ErrorAction Stop
    $stopwatch.Stop()
    $RESPONSE_TIME = $stopwatch.ElapsedMilliseconds
    
    Write-Host "Response time: ${RESPONSE_TIME}ms"
    
    if ($RESPONSE_TIME -lt 1000) {
        Write-Host "✅ EXCELLENT: API is fast (< 1 second)" -ForegroundColor Green
    } elseif ($RESPONSE_TIME -lt 3000) {
        Write-Host "⚠️  ACCEPTABLE: API is slow (> 1 second)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ POOR: API is very slow (> 3 seconds)" -ForegroundColor Red
        Write-Host "Possible causes:" -ForegroundColor Red
        Write-Host "  - Railway dyno is sleeping (add paid plan)" -ForegroundColor Red
        Write-Host "  - MongoDB connection is slow" -ForegroundColor Red
        Write-Host "  - Network latency issues" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Could not measure response time" -ForegroundColor Red
}

Write-Host ""

# Test 4: CORS Configuration
Write-Host "[TEST 4] Checking CORS headers..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri $HEALTH_ENDPOINT -Method Get -Headers @{"Origin" = "https://mwgbysama.vercel.app"} -TimeoutSec 10 -ErrorAction Stop
    
    if ($response.Headers["Access-Control-Allow-Origin"]) {
        Write-Host "✅ CORS ENABLED: Cross-origin requests allowed" -ForegroundColor Green
    } else {
        Write-Host "⚠️  WARNING: CORS headers may not be set properly" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Could not verify CORS configuration" -ForegroundColor Yellow
}

Write-Host ""

# Summary
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend URL: $BACKEND_URL"
Write-Host "API URL: $API_URL"
Write-Host "Frontend URL: https://mwgbysama.vercel.app"
Write-Host ""
Write-Host "✅ If all tests passed:" -ForegroundColor Green
Write-Host "  ✅ Backend is properly deployed" -ForegroundColor Green
Write-Host "  ✅ Mobile app should work" -ForegroundColor Green
Write-Host "  ✅ API is accessible from anywhere" -ForegroundColor Green
Write-Host ""
Write-Host "❌ If any test failed:" -ForegroundColor Red
Write-Host "  ❌ Check the error messages above" -ForegroundColor Red
Write-Host "  ❌ Visit Railway dashboard to debug" -ForegroundColor Red
Write-Host "  ❌ Check MongoDB connection" -ForegroundColor Red
Write-Host "  ❌ Verify environment variables are set" -ForegroundColor Red
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "📱 TEST FROM MOBILE:" -ForegroundColor Cyan
Write-Host "Visit: https://mwgbysama.vercel.app/api-health-check.html" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
