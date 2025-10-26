#!/bin/bash

# ============================================================================
# BACKEND DEPLOYMENT VERIFICATION SCRIPT
# ============================================================================
# This script verifies that the MWG Hostels backend is properly deployed
# to Railway and accessible from the internet
# ============================================================================

echo "🚀 MWG HOSTELS - BACKEND DEPLOYMENT VERIFICATION"
echo "=================================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BACKEND_URL="https://sama-production-9e28.up.railway.app"
API_URL="$BACKEND_URL/api"
HEALTH_ENDPOINT="$API_URL/health"

# Test 1: Check API Health Endpoint
echo -e "${BLUE}[TEST 1]${NC} Checking if API is accessible..."
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$HEALTH_ENDPOINT")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
BODY=$(echo "$HEALTH_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ SUCCESS${NC}: API is responding (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
else
    echo -e "${RED}❌ FAILED${NC}: API returned HTTP $HTTP_CODE"
    echo "Response: $BODY"
    echo ""
    echo -e "${YELLOW}⚠️  ACTION REQUIRED:${NC}"
    echo "  1. Go to https://railway.app/dashboard"
    echo "  2. Find 'sama-production' project"
    echo "  3. Check if service is Running (green)"
    echo "  4. Click 'Deploy' if it's stopped"
    echo "  5. Wait 2-3 minutes and try again"
    exit 1
fi

echo ""

# Test 2: Check Database Connection
echo -e "${BLUE}[TEST 2]${NC} Checking database connectivity..."
DB_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/hostels")
DB_HTTP_CODE=$(echo "$DB_RESPONSE" | tail -n1)
DB_BODY=$(echo "$DB_RESPONSE" | head -n-1)

if [ "$DB_HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ SUCCESS${NC}: Database is connected (HTTP $DB_HTTP_CODE)"
    echo "Response preview: $(echo "$DB_BODY" | head -c 100)..."
else
    echo -e "${RED}❌ FAILED${NC}: Database query failed (HTTP $DB_HTTP_CODE)"
    echo "Response: $DB_BODY"
    echo ""
    echo -e "${YELLOW}⚠️  ACTION REQUIRED:${NC}"
    echo "  1. Check MongoDB Atlas at https://cloud.mongodb.com"
    echo "  2. Verify connection string is correct in Railway env vars"
    echo "  3. Check if MongoDB cluster is running"
    echo "  4. Verify MONGODB_URI is set in Railway dashboard"
fi

echo ""

# Test 3: Response Time
echo -e "${BLUE}[TEST 3]${NC} Checking API response time..."
START_TIME=$(date +%s%N)
curl -s -o /dev/null "$HEALTH_ENDPOINT"
END_TIME=$(date +%s%N)
RESPONSE_TIME=$(( ($END_TIME - $START_TIME) / 1000000 ))

echo "Response time: ${RESPONSE_TIME}ms"

if [ $RESPONSE_TIME -lt 1000 ]; then
    echo -e "${GREEN}✅ EXCELLENT${NC}: API is fast (< 1 second)"
elif [ $RESPONSE_TIME -lt 3000 ]; then
    echo -e "${YELLOW}⚠️  ACCEPTABLE${NC}: API is slow (> 1 second)"
else
    echo -e "${RED}❌ POOR${NC}: API is very slow (> 3 seconds)"
    echo "Possible causes:"
    echo "  - Railway dyno is sleeping (add paid plan)"
    echo "  - MongoDB connection is slow"
    echo "  - Network latency issues"
fi

echo ""

# Test 4: Mobile Accessibility
echo -e "${BLUE}[TEST 4]${NC} Checking mobile compatibility..."
MOBILE_RESPONSE=$(curl -s -H "User-Agent: Mobile" "$HEALTH_ENDPOINT")

if echo "$MOBILE_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ MOBILE ACCESS${NC}: API responds to mobile requests"
else
    echo -e "${YELLOW}⚠️  WARNING${NC}: Mobile response may have issues"
fi

echo ""

# Test 5: CORS Configuration
echo -e "${BLUE}[TEST 5]${NC} Checking CORS headers..."
CORS_RESPONSE=$(curl -s -i -H "Origin: https://mwgbysama.vercel.app" "$HEALTH_ENDPOINT" 2>&1)

if echo "$CORS_RESPONSE" | grep -q "Access-Control-Allow-Origin"; then
    echo -e "${GREEN}✅ CORS ENABLED${NC}: Cross-origin requests allowed"
else
    echo -e "${YELLOW}⚠️  WARNING${NC}: CORS headers may not be set"
fi

echo ""

# Summary
echo "=================================================="
echo -e "${BLUE}VERIFICATION SUMMARY${NC}"
echo "=================================================="
echo ""
echo "Backend URL: $BACKEND_URL"
echo "API URL: $API_URL"
echo "Frontend URL: https://mwgbysama.vercel.app"
echo ""
echo -e "${GREEN}If all tests passed:${NC}"
echo "  ✅ Backend is properly deployed"
echo "  ✅ Mobile app should work"
echo "  ✅ API is accessible from anywhere"
echo ""
echo -e "${RED}If any test failed:${NC}"
echo "  ❌ Check the error messages above"
echo "  ❌ Visit Railway dashboard to debug"
echo "  ❌ Check MongoDB connection"
echo "  ❌ Verify environment variables are set"
echo ""
echo "=================================================="
echo "📱 TEST FROM MOBILE:"
echo "Visit: https://mwgbysama.vercel.app/api-health-check.html"
echo "=================================================="
echo ""
