# 🚂 RAILWAY DASHBOARD - QUICK GUIDE

## What is Railway?

Railway is where your **backend server** runs. Think of it like a computer in the cloud that runs your Node.js server 24/7.

---

## 🚨 CRITICAL: Check if Backend is Running

### Step 1: Open Railway Dashboard
Go to: **https://railway.app/dashboard**

### Step 2: Find Your Project
- Look for: **"sama-production"** project
- Click on it

### Step 3: Check Service Status
In the project, you should see two services:

1. **backend** (or server) - This is what you need ✅
2. **mongodb** (optional, if using Railway's MongoDB)

### Step 4: Look at the Status
- **🟢 Green Circle** = Running ✅ (Backend is online)
- **🔴 Red Circle** = Stopped ❌ (Backend is offline)
- **🟡 Yellow Circle** = Deploying ⏳ (Wait a few minutes)
- **⚫ Gray Circle** = Error ❌ (Something went wrong)

---

## 🔧 How to Fix if Backend is Stopped

### Option 1: Redeploy (Easiest)
1. Click the **backend** service
2. Click **"Deploy"** button (top right)
3. Select latest commit
4. Click **"Deploy"** again
5. Wait 2-3 minutes for deployment to complete

### Option 2: Restart Service
1. Click the **backend** service
2. Click **"Restart Service"** button
3. Wait for service to restart

### Option 3: Check Logs for Errors
1. Click the **backend** service
2. Click **"Logs"** tab
3. Look for red error messages
4. Common errors:
   - `MONGODB_URI not set` → Add to Environment Variables
   - `Port 5000 already in use` → Restart service
   - `Cannot connect to MongoDB` → Check connection string

---

## 📊 Important Information to Know

### Environment Variables (Configuration)
These are like settings for your server. If they're missing, the app breaks.

**Required Variables:**
- `NODE_ENV` = `production`
- `PORT` = `5000`
- `MONGODB_URI` = `mongodb+srv://...` (from MongoDB Atlas)
- `JWT_SECRET` = `mwg-super-secret-key-change-in-production-2024`
- `CLOUDINARY_CLOUD_NAME` = `dsu1po0tg`
- `CLOUDINARY_API_KEY` = `544812825552175`
- `CLOUDINARY_API_SECRET` = `TBeMJkwQ-Nd_Ybtg2H9YHlZa2vo`

**To Check/Add Environment Variables:**
1. Click **backend** service
2. Click **Variables** tab
3. See all variables listed
4. If any are missing, click **+ New Variable** to add

### Domains (URLs)
Railway auto-generates a URL for your server:

- **Current Domain:** `sama-production-9e28.up.railway.app`
- **API URL:** `https://sama-production-9e28.up.railway.app/api`
- **Health Check:** `https://sama-production-9e28.up.railway.app/api/health`

This is what your mobile app uses to connect!

---

## 🔍 How to Check if API is Working

### From Browser (Desktop)
1. Open a new tab
2. Go to: `https://sama-production-9e28.up.railway.app/api/health`
3. You should see:
   ```json
   {
     "status": "success",
     "message": "MWG Hostels API is running",
     "database": "connected",
     "timestamp": "2024-10-25T..."
   }
   ```

### From Mobile Phone
1. Open: `https://mwgbysama.vercel.app/api-health-check.html`
2. Click "Run Tests"
3. All tests should show ✅

---

## 📈 Monitoring & Troubleshooting

### Check Metrics
1. Click **backend** service
2. Click **Metrics** tab
3. See:
   - CPU usage (should be low)
   - Memory usage (should be reasonable)
   - Network usage
   - Error rate (should be 0%)

### Monitor Logs in Real-Time
1. Click **backend** service
2. Click **Logs** tab
3. See live activity
4. Scroll down to see latest messages
5. Red text = errors (bad)
6. Green/white text = normal (good)

---

## 🆘 Common Issues & Fixes

### Issue 1: Service Shows Red (Stopped)
**Solution:**
1. Click the service
2. Click "Restart Service"
3. Or click "Deploy" to redeploy

### Issue 2: Getting "Cannot connect to MongoDB" Error
**Solution:**
1. Check `MONGODB_URI` environment variable
2. Go to MongoDB Atlas dashboard
3. Verify your IP is whitelisted (IP Whitelist)
4. Test connection manually

### Issue 3: API Responds Slowly (> 3 seconds)
**Solution:**
1. Check if using free tier (will be slow)
2. Upgrade to paid Railway plan
3. Check database query performance
4. Optimize API code

### Issue 4: Seeing "Service Crashed" Error
**Solution:**
1. Check logs for JavaScript errors
2. Verify all environment variables are set
3. Restart service
4. If still broken, contact support

### Issue 5: Deploy Keeps Failing
**Solution:**
1. Check GitHub repo is up to date
2. Verify all files are committed
3. Check for syntax errors in code
4. Review deployment logs in Railway

---

## 🚀 Useful Dashboard Features

### 1. Deploy from GitHub
- Railway auto-deploys when you push to GitHub
- Check "Deployment" tab to see all deploys
- Rollback to previous version if needed

### 2. Environment Variables
- Store secrets here (passwords, API keys)
- Never hardcode sensitive info in files
- Each change triggers new deployment

### 3. Logs
- See real-time activity
- Helps debug errors
- Download logs for analysis

### 4. Metrics
- Monitor performance
- Alert if issues occur
- Track usage patterns

### 5. Project Settings
- Change project name
- Configure auto-deploy
- Set up alerts

---

## 📞 Quick Links

- **Railway Dashboard:** https://railway.app/dashboard
- **Railway Docs:** https://railway.app/docs
- **Railway Status:** https://status.railway.app
- **Your API:** https://sama-production-9e28.up.railway.app/api
- **Health Check:** https://sama-production-9e28.up.railway.app/api/health
- **Mobile Test:** https://mwgbysama.vercel.app/api-health-check.html

---

## ✅ QUICK CHECKLIST

Before saying "backend is down":

- [ ] Is Railway Dashboard showing green status?
- [ ] Did you wait 2-3 minutes after deployment?
- [ ] Are all environment variables set?
- [ ] Did you check the logs for errors?
- [ ] Can you reach https://sama-production-9e28.up.railway.app/api/health?
- [ ] Is your network connection working?
- [ ] Are you using HTTPS (not HTTP)?
- [ ] Have you tried restarting/redeploying?

If ALL are checked ✅, backend is working!

---

**🆘 NEED HELP?**

1. Check the logs first (Logs tab in Railway)
2. Look for red error messages
3. Try redeploying
4. Check if all variables are set
5. Restart the service
6. Contact Railway support if still broken

**Status Page:** https://status.railway.app

Good luck! 🚀
