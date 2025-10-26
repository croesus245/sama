# 🚨 MOBILE: "HOSTEL SERVER MIGHT BE OFFLINE" - TROUBLESHOOTING GUIDE

**Issue:** Your mobile phone shows "Unable to load hostel - server might be offline"

**Root Cause:** The backend API is not accessible from your mobile phone.

---

## ✅ QUICK FIX (5 minutes)

### Step 1: Test the API Health
1. **On your mobile phone**, open your browser
2. Go to: `https://mwgbysama.vercel.app/api-health-check.html`
3. Click "Run Tests"
4. Check the results

### Step 2: If Tests FAIL
The backend needs to be deployed to Railway. Do this:

```bash
# From your computer terminal:
cd c:\Users\croes\Desktop\sama\backend

# Set production environment
npm run deploy:prod
```

### Step 3: If Tests PASS
The problem is likely a **Vercel frontend issue**. Try:
1. **Hard refresh** on mobile: Hold power button + refresh
2. **Clear cache:** Settings → Storage → Clear cache
3. **Try incognito:** Open in private/incognito mode

---

## 📋 DETAILED DIAGNOSIS

### Is the Backend Running on Railway?

**Check:**
1. Go to https://railway.app/dashboard
2. Find the "sama-production" project
3. Click on the service
4. Look for status: **Green = Running**, Red = Stopped

**If Red (Stopped):**
- Click "Deploy" button
- Wait 2-3 minutes for deployment

**If No Project:**
- Create new Railway project
- Connect GitHub repo
- See DEPLOYMENT-GUIDE.md

### Is the API Responding?

**Test from mobile:**
Visit: `https://sama-production-9e28.up.railway.app/api/health`

**You should see:**
```json
{
  "status": "success",
  "message": "MWG Hostels API is running",
  "database": "connected",
  "timestamp": "2025-10-25T10:30:00Z"
}
```

**If you see error:**
- API is not deployed
- Or Railway service is down
- Or network is blocked

### Is MongoDB Connected?

**Check database:**
1. Go to https://cloud.mongodb.com
2. Login with credentials
3. Check "Collections" → see data there?
4. Look for "mwg-hostels" database

---

## 🔧 COMMON ISSUES & FIXES

### Issue 1: "Network Error" on Mobile

**Cause:** Mobile network might be blocking the API

**Fix:**
- Try on WiFi instead of cellular
- Try different WiFi network
- Try mobile hotspot from another phone

### Issue 2: "Connection Timeout"

**Cause:** API is too slow or not responding

**Fix:**
- Check Railway dashboard for errors
- Restart the service
- Check if MongoDB is running
- Increase timeout setting

### Issue 3: "CORS Error"

**Cause:** Frontend and backend URLs don't match

**Fix:**
- Check api-config.js has correct production URL
- Verify CORS is enabled in backend
- Clear browser cache

### Issue 4: App Works on Desktop but NOT on Mobile

**Cause:** Mobile browser settings or network

**Fix:**
- Disable private/incognito mode
- Enable cookies in settings
- Try different browser (Chrome/Firefox)
- Check if VPN is enabled (disable if yes)

### Issue 5: Works Sometimes, Fails Other Times

**Cause:** Railway service is flaky or restarting

**Fix:**
- Check Railway status page
- Look at deploy logs for errors
- Monitor uptime metrics
- Contact Railway support if persistent

---

## 🚀 DEPLOYMENT CHECKLIST

Make sure the backend is properly deployed:

- [ ] GitHub repo is up to date (push all changes)
- [ ] Railway project is linked to GitHub
- [ ] Environment variables are set in Railway:
  - [ ] MONGODB_URI
  - [ ] NODE_ENV=production
  - [ ] JWT_SECRET
  - [ ] CLOUDINARY_CLOUD_NAME
  - [ ] CLOUDINARY_API_KEY
  - [ ] CLOUDINARY_API_SECRET
- [ ] Service is showing as "Running" (green status)
- [ ] Recent deploy shows "Success"

---

## 📱 MOBILE-SPECIFIC FIXES

### For iPhone/iOS
1. **Settings → Safari → Clear History and Website Data**
2. **Try in "Incognito Mode" (Settings → Safari → Private Browsing)**
3. **Disable VPN** if enabled
4. **Try different WiFi or cellular**

### For Android
1. **Settings → Apps → Chrome → Storage → Clear Cache**
2. **Settings → Apps → Chrome → Storage → Clear Data**
3. **Try Incognito Mode (Chrome menu → New Incognito tab)**
4. **Disable VPN** if enabled
5. **Try different browser** (Firefox, Edge)

### For Both
1. Restart the phone
2. Disable WiFi, use cellular data instead
3. Test on different WiFi network
4. Try different browser
5. Contact IT support if nothing works

---

## ✅ VERIFICATION STEPS

After fixing, verify everything works:

### On Mobile Phone:
1. ✅ Open https://mwgbysama.vercel.app/
2. ✅ Wait for page to load (should see hostels)
3. ✅ Scroll down, see hostel cards
4. ✅ Click on a hostel
5. ✅ See hostel details load
6. ✅ No error messages

### Check Console for Errors:
1. Open Chrome on mobile
2. Press F12 (DevTools)
3. Click "Console" tab
4. Look for red errors
5. Screenshot and send to developer

---

## 📞 IF STILL NOT WORKING

**Gather this info and send to developer:**
1. Screenshot of error message
2. Screenshot of Console tab (F12)
3. Your mobile phone model and OS
4. Browser type and version
5. WiFi/Cellular network name
6. Time when error occurred
7. Steps you already tried

**Send to:**
- Email: support@mwghostels.com
- WhatsApp: +234-XXX-XXX-XXXX
- GitHub Issue: (create issue with details)

---

## 🏭 DEVELOPER QUICK FIX

If you need to fix this quickly:

```bash
# 1. Push latest code
git add .
git commit -m "Mobile API fix"
git push

# 2. Check Railway
# Go to https://railway.app/dashboard
# Click Deploy button if needed

# 3. Monitor logs
railway logs

# 4. Test API
curl https://sama-production-9e28.up.railway.app/api/health

# 5. Test from mobile
# Open api-health-check.html on phone
```

---

## 📊 STATUS DASHBOARD

Track backend status in real-time:

- **API Health:** https://sama-production-9e28.up.railway.app/api/health
- **Railway Dashboard:** https://railway.app/dashboard
- **MongoDB Status:** https://cloud.mongodb.com
- **Vercel Frontend:** https://mwgbysama.vercel.app/

---

**Still having issues?** Contact support immediately!

**Status:** Check the health check page for real-time diagnostics
