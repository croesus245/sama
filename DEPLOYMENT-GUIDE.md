# MWG Hostels Platform - Deployment & Setup Guide

**Last Updated:** October 25, 2025  
**Status:** Production-Ready  
**Version:** 2.1.0

---

## 🚀 Quick Start

### Local Development Setup

#### 1. Backend Setup (Express.js + MongoDB)

```bash
cd backend

# Install dependencies
npm install

# Start the server
npm start
# or use nodemon for auto-reload
npm run dev

# Server runs on: http://localhost:5000/api
# Health check: http://localhost:5000/api/health
```

**Required Environment Variables (.env):**
```
MONGODB_URI=mongodb+srv://mwgadmin:%40Qwerty_12345@cluster0.n8satkn.mongodb.net/mwg-hostels?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=development
JWT_SECRET=mwg-super-secret-key-change-in-production-2024
CLOUDINARY_CLOUD_NAME=dsu1po0tg
CLOUDINARY_API_KEY=544812825552175
CLOUDINARY_API_SECRET=TBeMJkwQ-Nd_Ybtg2H9YHlZa2vo
```

#### 2. Frontend Setup (Static HTML + JavaScript)

```bash
# Use Python built-in server or http-server
python -m http.server 8000

# or with npm
npm start  # uses http-server on port 3000
```

**Frontend runs on:** http://localhost:8000 (or :3000)

---

## 🌐 Production Deployment

### Backend Deployment (Railway)

1. **Connect Railway Project**
   ```bash
   # Login to Railway and link project
   railway login
   railway link
   ```

2. **Set Environment Variables in Railway**
   - Go to Railway Dashboard → Project Settings → Variables
   - Add all required `.env` variables
   - Ensure `NODE_ENV=production`
   - Set `PORT=` (Railway will auto-assign)

3. **Deploy**
   ```bash
   git push  # Railway auto-deploys on git push to main
   ```

4. **Verify Deployment**
   - API should be available at: `https://sama-production-9e28.up.railway.app/api`
   - Health check: `https://sama-production-9e28.up.railway.app/api/health`

### Frontend Deployment (Vercel)

1. **Connect Vercel Project**
   ```bash
   vercel login
   vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod  # Deploy to production
   ```

3. **Verify Deployment**
   - Site should be live at: https://mwgbysama.vercel.app/
   - Check Console: Open DevTools → Console tab → verify no errors

---

## ✅ Testing Checklist

### 1. API Endpoints Testing

```bash
# Health Check
curl http://localhost:5000/api/health

# API Info
curl http://localhost:5000/api

# Get all hostels
curl http://localhost:5000/api/hostels

# Get single hostel
curl http://localhost:5000/api/hostels/{hostel_id}
```

### 2. Authentication Testing

#### Realtor Login
```bash
curl -X POST http://localhost:5000/api/realtor-auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "realtor@mwghostels.com",
    "password": "futarian"
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "realtor": {
      "_id": "...",
      "email": "realtor@mwghostels.com",
      "fullName": "...",
      "status": "active"
    }
  }
}
```

#### Student Login
```bash
curl -X POST http://localhost:5000/api/students/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test@student.com",
    "password": "password123"
  }'
```

### 3. Hostel CRUD Testing

#### Create Hostel (Protected Route)
```bash
curl -X POST http://localhost:5000/api/hostels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Test Hostel",
    "location": "FUTA Campus",
    "price": 50000,
    "whatsapp": "+234801234567",
    "features": ["WiFi", "Generator"],
    "description": "Great hostel"
  }'
```

### 4. Frontend Testing

#### Pages to Test
- ✅ **Home Page** (`index.html`)
  - Check: Logo loads, navigation works
  - Check: Hero section visible on all screen sizes
  
- ✅ **Hostels Listing** (`hostels.html`)
  - Check: Hostels load from API
  - Check: Filtering works (price, location)
  - Check: Responsive on mobile/tablet/desktop
  
- ✅ **Realtor Dashboard** (`enhanced-realtor-dashboard.html`)
  - Check: Login required (redirects to login if not authenticated)
  - Check: Can add new hostel
  - Check: Can edit hostel
  - Check: Can view applications
  
- ✅ **Apply Form** (`apply.html`)
  - Check: Form loads with hostel details
  - Check: Form validation works
  - Check: Application submits successfully
  
- ✅ **Realtor Login** (`realtor-login.html`)
  - Check: Form validation
  - Check: Login success → redirects to dashboard
  - Check: Error messages display correctly
  
- ✅ **Student Register** (`student-register.html`)
  - Check: Form validation
  - Check: Registration success
  - Check: Student can login

#### Mobile Testing (360×640)
```
✅ No content overflow
✅ Buttons are clickable (min 44×44px)
✅ Forms are usable on mobile keyboard
✅ Images load and scale properly
✅ Navigation is accessible
```

#### Tablet Testing (768×1024)
```
✅ Layout adapts properly
✅ All features accessible
✅ No horizontal scrolling
```

#### Desktop Testing (1440×900)
```
✅ Full width optimized
✅ All features visible
✅ Professional appearance
```

---

## 🐛 Troubleshooting

### Issue: API Returns 404

**Solution:** Check that:
- Backend is running (`npm start`)
- API URL in `api-config.js` is correct
- Route exists in backend

### Issue: CORS Error in Console

**Solution:** Check `.env` and backend `simple-server.js`:
- Verify `CORS origins` includes your frontend URL
- Restart backend after `.env` changes

### Issue: MongoDB Connection Fails

**Solution:**
```bash
# Check MongoDB URI
echo $MONGODB_URI

# Test connection
mongosh "mongodb+srv://mwgadmin:PASSWORD@cluster0.n8satkn.mongodb.net/mwg-hostels"
```

### Issue: Login Fails on Mobile

**Solution:**
- Clear browser cache
- Disable private/incognito mode
- Enable cookies in browser settings
- Try different browser (Chrome recommended)

### Issue: Images Don't Upload

**Solution:**
- Check Cloudinary credentials in `.env`
- Verify image file size < 5MB
- Check browser console for detailed error
- Verify Cloudinary API key is active

---

## 📊 Console Errors to Fix

### Expected Console Logs (Development)
```
✅ 🔗 API Configuration loaded
✅ 🚀 MWG Hostels API Server running on port 5000
✅ ✅ MongoDB connected successfully
```

### Errors to Fix
```
❌ 404 Not Found errors → Fix routes
❌ CORS errors → Fix CORS configuration
❌ "Cannot read property" → Check API response format
❌ "token is undefined" → Fix authentication flow
```

---

## 🔐 Security Checklist

- [ ] Change JWT_SECRET before production
- [ ] Enable HTTPS (Vercel/Railway auto-enable)
- [ ] Set NODE_ENV=production
- [ ] Restrict CORS to known domains
- [ ] Use strong MongoDB password
- [ ] Don't commit .env to Git (add to .gitignore)
- [ ] Rate limit enabled on API routes
- [ ] Input validation on all forms
- [ ] Password hashing with bcrypt

---

## 📱 Responsive Design Breakpoints

```css
/* Mobile First */
Extra Small: < 360px (old phones)
Small: 360px - 640px (mobile)
Medium: 641px - 768px (tablet portrait)
Large: 769px - 1024px (tablet landscape)
Extra Large: 1025px+ (desktop)

/* Master Responsive Fix Applied */
✅ No inline styles
✅ Flexbox/Grid layout
✅ Fluid typography
✅ Responsive images
```

---

## 🎯 Feature Checklist

### Realtor Features
- [ ] Register as realtor
- [ ] Login to dashboard
- [ ] Add hostel with image upload
- [ ] Edit hostel details
- [ ] Delete hostel
- [ ] View applications
- [ ] Respond to applications
- [ ] Track application stats

### Student Features
- [ ] Browse available hostels
- [ ] Filter by price/location
- [ ] View hostel details
- [ ] Apply for hostel
- [ ] Track applications
- [ ] Save favorite hostels
- [ ] View saved hostels

### Admin Features
- [ ] Login to admin panel
- [ ] View all realtors
- [ ] Approve/reject realtors
- [ ] Suspend realtor accounts
- [ ] View platform statistics
- [ ] Remove duplicate hostels

---

## 📞 Support & Documentation

**Backend API Documentation:**
- Health Check: `/api/health`
- API Info: `/api`

**Important Files:**
- Frontend: `index.html`, `hostels.html`, `realtor-login.html`, `apply.html`
- Backend: `backend/simple-server.js`, `backend/routes/*`
- Config: `api-config.js`, `backend/.env`

---

## 🚀 Next Steps

1. **Local Testing:** Run backend + frontend locally
2. **API Testing:** Use curl or Postman to test endpoints
3. **Frontend Testing:** Test all pages and forms
4. **Mobile Testing:** Test on actual mobile device
5. **Production Deploy:** Deploy to Railway (backend) + Vercel (frontend)
6. **Final QA:** Test all features on live site
7. **Monitor:** Check logs and errors daily

---

**Version:** 2.1.0  
**Status:** ✅ Production-Ready  
**Last Deploy:** October 25, 2025
