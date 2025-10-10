# ========================================
# 🚂 RAILWAY DEPLOYMENT - QUICK START
# ========================================

## ✅ Pre-Deployment Checklist

All required files for Railway deployment:
- [x] railway.json - Railway configuration
- [x] nixpacks.toml - Build configuration  
- [x] Procfile - Start command
- [x] .railwayignore - Ignore files
- [x] simple-server.js - Main server file
- [x] package.json - Dependencies

## 🚀 DEPLOY IN 5 MINUTES

### Step 1: Go to Railway (2 min)
1. Open: https://railway.app
2. Click "Login" → Sign in with GitHub (croesus245)
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose repository: **croesus245/sama**

### Step 2: Configure Root Directory (30 sec)
Railway will ask about the directory:
- Set root directory to: **backend**
- Railway auto-detects Node.js project

### Step 3: Add Environment Variables (2 min)
Click "Variables" tab and add these:

```
MONGODB_URI=mongodb+srv://mwgadmin:%40Qwerty_12345@cluster0.n8satkn.mongodb.net/mwg-hostels?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=mwg-railway-production-secret-2024

NODE_ENV=production

FRONTEND_URL=https://mwgbysama.vercel.app
```

### Step 4: Deploy (30 sec)
- Railway automatically starts building
- Wait 2-3 minutes for deployment
- ✅ Done!

### Step 5: Get Your URL (30 sec)
1. Click "Settings" → "Domains"
2. Click "Generate Domain"
3. Copy your URL (example):
   ```
   https://mwg-hostels-backend-production.up.railway.app
   ```

## 🧪 Test Your Deployment

Open in browser:
```
https://your-railway-url.up.railway.app/api/health
```

Should return:
```json
{
  "status": "success",
  "message": "MWG Hostels API is running"
}
```

## 🔄 Update Frontend API URL

After deployment, update these frontend files to use Railway URL:

### Files to Update:
1. `api-connector.js`
2. `api-integration.js`
3. Any file with `localhost:5000`

### Change:
```javascript
// OLD
const API_URL = 'http://localhost:5000/api';

// NEW (Replace with YOUR Railway URL)
const API_URL = 'https://your-railway-url.up.railway.app/api';
```

### OR Use Environment Detection:
```javascript
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api'
    : 'https://your-railway-url.up.railway.app/api';
```

## 🎉 You're Done!

Your backend is now live on Railway!

### What You Have:
- ✅ Backend: Railway URL
- ✅ Frontend: https://mwgbysama.vercel.app
- ✅ Database: MongoDB Atlas
- ✅ Auto-deployments on git push

### Next Steps:
1. Update frontend API URLs
2. Test all features online
3. Share your live site!

## 💰 Cost: FREE
Railway provides $5 free credit per month - plenty for your project!

## 📚 Need Help?
See full guide: RAILWAY-DEPLOYMENT-GUIDE.md

---
**Deployment Time**: ~5 minutes
**Difficulty**: Easy
**Status**: Ready to deploy! 🚀
