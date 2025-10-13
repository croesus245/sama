# 🚀 Complete Deployment Guide for MWG Hostels

## 🎯 Quick Start - Deploy Now!

### Step 1: Deploy Frontend to Vercel (1 minute)

```powershell
# Run the deployment script
.\deploy.ps1
```

**OR manually:**

```powershell
# 1. Add all files
git add .

# 2. Commit
git commit -m "feat: Complete application system with WhatsApp integration"

# 3. Push to GitHub (Vercel will auto-deploy)
git push origin master
```

✅ **Your site will be live at**: https://mwgbysama.vercel.app/

---

## 🔧 Current Setup Status

### ✅ What's Working:
- **Frontend**: Ready for Vercel deployment
- **Application System**: Complete with all features
- **WhatsApp Integration**: Working with pre-filled messages
- **Nigerian Localization**: Currency (₦) and phone (+234)
- **Database**: MongoDB Atlas connected
- **Backend**: Running locally on port 5000

### ⚠️ What Needs Attention:
- **Backend Hosting**: Heroku app not deployed yet

---

## 🌐 Backend Deployment Options

### Option 1: Deploy to Heroku (Recommended)

#### A. Create New Heroku App

```powershell
# 1. Login to Heroku
heroku login

# 2. Create app
heroku create mwg-hostels-backend

# 3. Add MongoDB Atlas addon or use existing
heroku addons:create mongolab:sandbox -a mwg-hostels-backend
# OR set your MongoDB Atlas URI
heroku config:set MONGODB_URI="your_mongodb_uri" -a mwg-hostels-backend

# 4. Set other environment variables
heroku config:set NODE_ENV=production -a mwg-hostels-backend
heroku config:set FRONTEND_URL=https://mwgbysama.vercel.app -a mwg-hostels-backend

# 5. Deploy backend
cd backend
git init
heroku git:remote -a mwg-hostels-backend
git add .
git commit -m "Initial backend deployment"
git push heroku master
```

#### B. Update api-config.js with new Heroku URL

After deployment, update the production URL in `api-config.js`:

```javascript
production: 'https://mwg-hostels-backend.herokuapp.com'
```

### Option 2: Use Render.com (Free Alternative)

```powershell
# 1. Go to render.com
# 2. Connect GitHub repo
# 3. Select backend folder
# 4. Add environment variables
# 5. Deploy
```

### Option 3: Use Railway.app (Modern Alternative)

```powershell
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
cd backend
railway init

# 4. Deploy
railway up
```

### Option 4: Deploy Backend to Vercel (Serverless)

Create `backend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "simple-server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/simple-server.js"
    }
  ]
}
```

Then deploy:
```powershell
cd backend
vercel --prod
```

---

## 🚀 Quick Deploy (Frontend Only - Using Local Backend)

If you want to deploy the frontend now and keep backend running locally for testing:

### 1. Update api-config.js for hybrid mode:

```javascript
// Option to use ngrok or similar for local backend
const API_CONFIG = {
    isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    
    // API Base URLs
    local: 'http://localhost:5000',
    production: 'https://YOUR_NGROK_URL.ngrok.io', // Temporary solution
    
    getBaseURL() {
        return this.isLocalhost ? this.local : this.production;
    },
    // ... rest of config
};
```

### 2. Use ngrok to expose local backend:

```powershell
# Install ngrok if needed
# Then run:
ngrok http 5000
```

Copy the https URL and update api-config.js production URL.

### 3. Deploy frontend:

```powershell
git add api-config.js
git commit -m "Update API config"
git push origin master
```

---

## ✅ Recommended: Full Production Deployment

### Complete Setup (30 minutes):

#### 1. Backend on Heroku

```powershell
# Create and deploy backend
heroku create mwg-hostels-api-2025
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set FRONTEND_URL="https://mwgbysama.vercel.app"
cd backend
git init
heroku git:remote -a mwg-hostels-api-2025
git add .
git commit -m "Production backend"
git push heroku master
```

#### 2. Update Frontend Config

Edit `api-config.js`:
```javascript
production: 'https://mwg-hostels-api-2025.herokuapp.com'
```

#### 3. Deploy Frontend

```powershell
git add api-config.js
git commit -m "Update production API URL"
git push origin master
```

#### 4. Test Everything

```powershell
# Test backend
Invoke-WebRequest -Uri "https://mwg-hostels-api-2025.herokuapp.com/api/health"

# Test frontend
Start-Process "https://mwgbysama.vercel.app"
```

---

## 🧪 Testing After Deployment

### Frontend Tests:
1. Visit https://mwgbysama.vercel.app/
2. Browse hostels
3. Click "Apply Now"
4. Fill application form
5. Submit
6. Click WhatsApp button
7. Verify message pre-filled

### Backend Tests:
```powershell
# Health check
Invoke-WebRequest -Uri "https://YOUR_BACKEND_URL/api/health"

# Get hostels
Invoke-WebRequest -Uri "https://YOUR_BACKEND_URL/api/hostels"

# Test application submission (use Postman or similar)
```

---

## 📊 Environment Variables Needed

### Backend (Heroku/Render/Railway):
```
MONGODB_URI=mongodb+srv://...
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://mwgbysama.vercel.app
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### How to Set on Heroku:
```powershell
heroku config:set VARIABLE_NAME="value" -a your-app-name
```

---

## 🎯 What Happens After Deployment?

### Automatic:
- ✅ Vercel detects git push
- ✅ Builds your site
- ✅ Deploys to production
- ✅ Updates https://mwgbysama.vercel.app/

### You'll Get:
- ✅ Working hostel platform
- ✅ Application system
- ✅ WhatsApp integration
- ✅ Nigerian localization
- ✅ Mobile responsive
- ✅ Fast loading (CDN)

---

## 🆘 Troubleshooting

### Issue: "No such app" on Heroku
**Solution**: The Heroku app doesn't exist yet. Follow "Backend Deployment Options" above.

### Issue: CORS errors after deployment
**Solution**: Make sure backend has:
```javascript
const allowedOrigins = [
  'https://mwgbysama.vercel.app',
  'http://localhost:8000'
];
```

### Issue: API not loading on production
**Solution**: Check browser console, verify:
1. Backend URL in api-config.js is correct
2. Backend is running (test /api/health)
3. CORS is configured properly

---

## 💡 Quick Decision Matrix

**Want to deploy RIGHT NOW?**
→ Use deploy.ps1 (frontend only, keep backend local)

**Want full production setup?**
→ Follow "Complete Setup" guide above

**Testing locally first?**
→ Keep using localhost:8000 and localhost:5000

**Need backend hosting help?**
→ Use Render.com (easiest, free tier)

---

## 🎉 Ready to Go!

The fastest path to production:

```powershell
# Step 1: Deploy frontend (1 minute)
.\deploy.ps1

# Step 2: Deploy backend (choose one platform)
# - Heroku (see guide above)
# - Render.com (create new web service, connect repo)
# - Railway.app (railway up)

# Step 3: Update api-config.js with backend URL

# Step 4: Push changes
git add api-config.js
git commit -m "Production ready"
git push origin master

# Step 5: Test!
Start-Process "https://mwgbysama.vercel.app"
```

**That's it!** 🚀✨
