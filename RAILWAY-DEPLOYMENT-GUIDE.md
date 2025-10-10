# 🚂 Railway Deployment Guide - MWG Hostels Backend

## 📋 Overview
This guide will help you deploy your MWG Hostels backend to Railway.app, a modern deployment platform with free tier and automatic deployments.

---

## ✅ Prerequisites

Before deploying, make sure you have:
- [x] GitHub account (croesus245/sama repository)
- [x] Railway account (sign up at https://railway.app)
- [x] MongoDB Atlas database (already set up)
- [x] Backend code pushed to GitHub

---

## 🚀 Step-by-Step Deployment

### Step 1: Sign Up / Login to Railway

1. Go to **https://railway.app**
2. Click **"Login"** or **"Start a New Project"**
3. Sign in with your **GitHub account** (croesus245)
4. Authorize Railway to access your repositories

---

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: **croesus245/sama**
4. Railway will detect your backend automatically

---

### Step 3: Configure Deployment

1. Railway will ask about the root directory
2. Set root directory to: **`backend`**
3. Railway will auto-detect Node.js and use `nixpacks.toml`

---

### Step 4: Add Environment Variables

Click on your deployed service → **"Variables"** tab → Add these:

```bash
# Required Environment Variables

# MongoDB Connection
MONGODB_URI=mongodb+srv://mwgadmin:%40Qwerty_12345@cluster0.n8satkn.mongodb.net/mwg-hostels?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret (IMPORTANT: Change this!)
JWT_SECRET=mwg-railway-production-secret-key-2024-change-this

# Node Environment
NODE_ENV=production

# Port (Railway provides this automatically, but you can set it)
PORT=5000

# Frontend URL (Your Vercel URL)
FRONTEND_URL=https://mwgbysama.vercel.app
```

**Important Notes:**
- ✅ Railway auto-assigns a port via `$PORT` environment variable
- ✅ Your backend code already uses `process.env.PORT || 5000`
- ✅ Don't hardcode the port in Railway

---

### Step 5: Deploy

1. Railway will automatically start building
2. Wait for deployment to complete (2-3 minutes)
3. You'll see: ✅ **"Deployed successfully"**

---

### Step 6: Get Your Backend URL

1. Go to your Railway project
2. Click on **"Settings"** tab
3. Under **"Domains"**, click **"Generate Domain"**
4. Railway will give you a URL like:
   ```
   https://mwg-hostels-backend-production.up.railway.app
   ```
5. **Copy this URL** - you'll need it for frontend!

---

## 🔧 Configure Frontend to Use Railway Backend

After deployment, update your frontend API configuration:

### Option A: Update API connector files

1. Find all API files in your frontend:
   - `api-connector.js`
   - `api-integration.js`
   - Any file with `localhost:5000`

2. Replace all instances of:
   ```javascript
   // OLD (Local)
   const API_URL = 'http://localhost:5000/api';
   
   // NEW (Railway - Use your actual URL)
   const API_URL = 'https://mwg-hostels-backend-production.up.railway.app/api';
   ```

### Option B: Use environment detection

Update your API config to detect environment:

```javascript
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api'  // Local development
    : 'https://mwg-hostels-backend-production.up.railway.app/api';  // Production
```

---

## 🧪 Test Your Deployment

### 1. Test Health Endpoint

Open in browser:
```
https://your-railway-url.up.railway.app/api/health
```

Should return:
```json
{
  "status": "success",
  "message": "MWG Hostels API is running",
  "timestamp": "2024-10-11T12:00:00.000Z",
  "database": "connected"
}
```

### 2. Test API Info

```
https://your-railway-url.up.railway.app/api
```

Should show all available endpoints.

### 3. Test Hostels Endpoint

```
https://your-railway-url.up.railway.app/api/hostels
```

Should return list of hostels (might be empty if none added yet).

---

## 🔄 Automatic Deployments

Railway automatically redeploys when you push to GitHub:

1. Make changes to your backend code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update backend"
   git push origin master
   ```
3. Railway detects the push and redeploys automatically
4. Check Railway dashboard for deployment status

---

## 📊 Monitor Your Deployment

### Railway Dashboard Features:

1. **Logs**: View real-time server logs
2. **Metrics**: CPU, Memory, Network usage
3. **Deployments**: History of all deployments
4. **Variables**: Manage environment variables
5. **Settings**: Configure custom domains

### View Logs:
1. Go to Railway dashboard
2. Click on your service
3. Click **"Logs"** tab
4. See real-time console output

---

## 🌐 Custom Domain (Optional)

### Add Your Own Domain:

1. Go to Railway dashboard
2. Click **"Settings"** → **"Domains"**
3. Click **"Custom Domain"**
4. Enter your domain: `api.mwghostels.com`
5. Add DNS records (Railway will show you what to add):
   ```
   Type: CNAME
   Name: api
   Value: your-project.up.railway.app
   ```
6. Wait for DNS propagation (5-60 minutes)

---

## 💰 Railway Pricing

### Free Tier (Hobby Plan):
- ✅ $5 free credit per month
- ✅ 500 hours of usage
- ✅ 512 MB RAM
- ✅ 1 GB Disk
- ✅ Shared CPU
- ✅ Perfect for your project!

### Pro Plan ($5/month):
- More resources
- Better performance
- Priority support

**Your backend should easily fit in the free tier!**

---

## 🔒 Security Best Practices

### 1. Change JWT Secret
Replace the JWT_SECRET in Railway variables with a strong random string:
```bash
# Generate a strong secret (run in terminal):
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Enable CORS Properly
Make sure your backend only allows requests from your Vercel domain:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### 3. Use HTTPS Only
Railway provides automatic HTTPS - always use it!

---

## 🐛 Troubleshooting

### Issue 1: Deployment Failed

**Check Build Logs:**
1. Railway dashboard → Logs
2. Look for error messages
3. Common issues:
   - Missing dependencies
   - Wrong start command
   - Node version mismatch

**Solution:**
```bash
# Make sure package.json has correct start script
"scripts": {
  "start": "node simple-server.js"
}
```

---

### Issue 2: Database Connection Failed

**Error:** "MongoDB connection error"

**Check:**
1. MONGODB_URI is correct in Railway variables
2. MongoDB Atlas allows Railway IPs (set to 0.0.0.0/0)
3. Password is URL-encoded (`@` becomes `%40`)

---

### Issue 3: 502 Bad Gateway

**Possible Causes:**
- Backend crashed
- Port not configured correctly
- Out of memory

**Solution:**
1. Check Railway logs for crash reasons
2. Ensure you're using `process.env.PORT`
3. Restart the service

---

### Issue 4: CORS Errors

**Error:** "Access-Control-Allow-Origin"

**Solution:**
Make sure FRONTEND_URL in Railway variables matches your Vercel URL exactly:
```
FRONTEND_URL=https://mwgbysama.vercel.app
```

(No trailing slash!)

---

## 📝 Environment Variables Checklist

Copy this to Railway Variables tab:

```env
# MongoDB
MONGODB_URI=mongodb+srv://mwgadmin:%40Qwerty_12345@cluster0.n8satkn.mongodb.net/mwg-hostels?retryWrites=true&w=majority&appName=Cluster0

# JWT (GENERATE NEW SECRET!)
JWT_SECRET=your-super-secure-random-string-here

# Environment
NODE_ENV=production

# Frontend
FRONTEND_URL=https://mwgbysama.vercel.app

# Optional (for email features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@mwghostels.com
```

---

## 🎯 Post-Deployment Steps

After successful deployment:

### 1. Update Frontend API URLs
- [ ] Update all API calls to use Railway URL
- [ ] Test student registration
- [ ] Test realtor login
- [ ] Test hostel browsing

### 2. Update README.md
- [ ] Add Railway backend URL to documentation
- [ ] Update deployment instructions

### 3. Test All Features
- [ ] Student registration and login
- [ ] Realtor dashboard
- [ ] Admin panel
- [ ] Hostel filtering
- [ ] WhatsApp integration

### 4. Share with Users
- [ ] Frontend: https://mwgbysama.vercel.app
- [ ] Backend: https://your-railway-url.up.railway.app

---

## 🚀 Quick Deployment Checklist

- [ ] Railway account created
- [ ] Repository connected (croesus245/sama)
- [ ] Root directory set to `backend`
- [ ] Environment variables added
- [ ] Custom domain generated
- [ ] Backend URL copied
- [ ] Health check passes
- [ ] Frontend updated with Railway URL
- [ ] All features tested
- [ ] Logs monitored

---

## 📚 Useful Railway Commands

### View Logs:
```bash
# Install Railway CLI (optional)
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs

# Check status
railway status
```

---

## 🎉 Success Indicators

Your deployment is successful when:

✅ Railway dashboard shows "Deployed"
✅ Health check returns 200 OK
✅ MongoDB shows "connected" in health check
✅ Frontend can make API calls
✅ Student registration works
✅ Realtor login works
✅ No CORS errors in browser console

---

## 🔗 Important Links

- **Railway Dashboard**: https://railway.app/dashboard
- **Railway Docs**: https://docs.railway.app
- **Your Frontend**: https://mwgbysama.vercel.app
- **Your Backend**: (Will be generated after deployment)
- **MongoDB Atlas**: https://cloud.mongodb.com

---

## 📞 Support

If you encounter issues:

1. **Check Railway Logs** (most issues show here)
2. **Check Railway Docs**: https://docs.railway.app
3. **Railway Discord**: https://discord.gg/railway
4. **MongoDB Support**: Check Atlas connection

---

## 🎊 What's Next?

After successful deployment:

1. ✅ **Monitor**: Check Railway dashboard regularly
2. ✅ **Optimize**: Upgrade to Pro if needed
3. ✅ **Secure**: Add custom domain with SSL
4. ✅ **Scale**: Railway auto-scales with traffic
5. ✅ **Backup**: MongoDB Atlas handles backups

---

**Deployment Time**: ~10 minutes
**Difficulty**: Easy
**Cost**: FREE (with $5 monthly credit)

**You're ready to deploy! 🚀**
