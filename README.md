# MWG Hostels Platform - Complete README

**Platform:** https://mwgbysama.vercel.app/  
**Backend API:** https://sama-production-9e28.up.railway.app/api  
**Status:** ✅ Production Ready  
**Version:** 2.1.0  
**Last Updated:** October 25, 2025

---

## 📋 Overview

**MWG Hostels** is a comprehensive hostel accommodation platform built for students at FUTA (Federal University of Technology, Akure). The platform connects hostel owners (Realtors) with students seeking quality accommodation near campus gates.

### Key Features

#### For Students
- 🏠 Browse available hostels with detailed information
- 🔍 Filter by price, location, and amenities
- 📋 Apply for hostel directly through the platform
- 💾 Save favorite hostels for later
- 📱 Track application status in real-time
- 🔗 Direct WhatsApp contact with hostel owners

#### For Realtors
- ✅ Register and manage business profile
- 🏢 Add unlimited hostel listings
- 🖼️ Upload high-quality images (via Cloudinary)
- 📊 View and track student applications
- 💬 Communicate with potential tenants
- 📈 Monitor hostel statistics

#### For Admins
- 👥 Approve/reject realtor registrations
- 🏘️ Monitor platform hostels
- ⚙️ Manage user accounts
- 📊 View platform statistics
- 🛡️ Enforce platform policies

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Responsive design with Flexbox/Grid
- **JavaScript (ES6+)** - Dynamic interactions
- **Cloudinary** - Image optimization and delivery
- **PWA** - Offline support and installable

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database
- **JWT** - Secure authentication
- **Multer** - File upload handling
- **Bcrypt** - Password encryption
- **Socket.IO** - Real-time messaging (future)

### Infrastructure
- **Railway.app** - Backend hosting
- **Vercel** - Frontend CDN hosting
- **MongoDB Atlas** - Database hosting
- **Cloudinary** - Image storage and CDN

---

## 🚀 Getting Started

### Quick Links
- 🏠 [Home](https://mwgbysama.vercel.app/)
- 🏘️ [Browse Hostels](https://mwgbysama.vercel.app/hostels.html)
- 👨‍💼 [Realtor Login](https://mwgbysama.vercel.app/realtor-login.html)
- 📝 [Student Registration](https://mwgbysama.vercel.app/student-register.html)
- 📊 [Realtor Dashboard](https://mwgbysama.vercel.app/enhanced-realtor-dashboard.html)

### For Local Development

**Prerequisites:**
- Node.js 18+ installed
- npm or yarn package manager
- MongoDB Atlas account (for database)
- Cloudinary account (for image uploads)

**Setup Instructions:**

```bash
# Clone repository
git clone https://github.com/your-repo/mwg-hostels.git
cd mwg-hostels

# Backend setup
cd backend
npm install
cp .env.example .env  # Configure with your credentials
npm start

# Frontend setup (in new terminal)
npm start  # Starts on http://localhost:3000

# Or use Python server
python -m http.server 8000
```

**Backend runs on:** http://localhost:5000/api  
**Frontend runs on:** http://localhost:3000 (or :8000)

---

## 📁 Project Structure

```
mwg-hostels/
├── index.html                          # Home page
├── hostels.html                        # Hostel listing
├── realtor-login.html                  # Realtor login
├── realtor-register.html               # Realtor signup
├── student-register.html               # Student signup
├── apply.html                          # Application form
├── enhanced-realtor-dashboard.html     # Realtor dashboard
├── my-applications.html                # Student apps tracker
├── admin-dashboard.html                # Admin panel
│
├── styles.css                          # Main CSS
├── hostel-style.css                    # Hostel-specific styles
├── master-responsive-fix.css           # Mobile/tablet/desktop
├── glass-morphism-global.css          # Modern UI effects
│
├── api-config.js                       # API configuration
├── hostel-api.js                       # Hostel API wrapper
├── form-handler-global.js              # Form utilities
├── storage-handler.js                  # Storage management
├── modal-system.js                     # Modal handling
│
├── backend/
│   ├── simple-server.js               # Server entry point
│   ├── package.json                   # Dependencies
│   ├── .env                           # Environment variables
│   │
│   ├── models/
│   │   ├── Hostel.js                 # Hostel schema
│   │   ├── Realtor.js                # Realtor schema
│   │   ├── Student.js                # Student schema
│   │   ├── Application.js            # Application schema
│   │   └── Admin.js                  # Admin schema
│   │
│   ├── routes/
│   │   ├── hostels.js                # Hostel endpoints
│   │   ├── realtorAuth.js            # Realtor auth
│   │   ├── studentAuth.js            # Student auth
│   │   ├── applications.js           # Application endpoints
│   │   ├── upload.js                 # Image upload
│   │   └── adminPanel.js             # Admin endpoints
│   │
│   ├── middleware/
│   │   ├── auth.js                   # Auth middleware
│   │   └── adminAuth.js              # Admin auth
│   │
│   └── utils/
│       ├── token.js                  # JWT utilities
│       ├── cloudinary.js             # Image upload
│       └── email.js                  # Email service
│
├── DEPLOYMENT-GUIDE.md                # Full deployment steps
├── PRODUCTION-READINESS-CHECKLIST.md  # QA checklist
└── README.md                          # This file
```

---

## 📚 API Documentation

### Base URL
- **Development:** `http://localhost:5000/api`
- **Production:** `https://sama-production-9e28.up.railway.app/api`

### Authentication Endpoints

#### Realtor Registration
```http
POST /realtor-auth/register
Content-Type: application/json

{
  "email": "realtor@example.com",
  "password": "SecurePass123",
  "fullName": "John Doe",
  "phoneNumber": "+2348012345678",
  "whatsapp": "+2348012345678",
  "businessName": "Premium Hostels Ltd"
}
```

#### Realtor Login
```http
POST /realtor-auth/login
Content-Type: application/json

{
  "email": "realtor@example.com",
  "password": "SecurePass123",
  "rememberMe": true
}
```

#### Student Registration
```http
POST /students/register
Content-Type: application/json

{
  "fullName": "Jane Student",
  "email": "jane@student.com",
  "matric": "FT20045",
  "phone": "+2348012345678",
  "whatsapp": "+2348012345678",
  "department": "Computer Science",
  "password": "SecurePass123"
}
```

#### Student Login
```http
POST /students/login
Content-Type: application/json

{
  "identifier": "jane@student.com",  // email or matric
  "password": "SecurePass123"
}
```

### Hostel Endpoints

#### Get All Hostels
```http
GET /hostels?location=FUTA&minPrice=30000&maxPrice=100000
```

#### Get Single Hostel
```http
GET /hostels/{hostelId}
```

#### Create Hostel (Protected)
```http
POST /hostels
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Paradise Hostel",
  "location": "Akure, Ondo",
  "price": 50000,
  "whatsapp": "+2348012345678",
  "features": ["WiFi", "Generator", "Water"],
  "description": "Best hostel near FUTA",
  "roomType": "Shared",
  "gender": "Mixed"
}
```

#### Update Hostel (Protected)
```http
PUT /hostels/{hostelId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 55000
}
```

#### Delete Hostel (Protected)
```http
DELETE /hostels/{hostelId}
Authorization: Bearer {token}
```

### Application Endpoints

#### Submit Application
```http
POST /applications/submit
Content-Type: application/json

{
  "applicationData": {
    "applicationId": "APP-123456",
    "hostelId": "{hostelId}",
    "studentInfo": {
      "firstName": "Jane",
      "lastName": "Student",
      "email": "jane@student.com",
      "phone": "+2348012345678",
      "whatsapp": "+2348012345678",
      "studentId": "FT20045",
      "level": "300",
      "department": "Computer Science"
    },
    "accommodation": {
      "roomType": "shared",
      "moveInDate": "2025-11-01",
      "duration": "academic_year"
    }
  }
}
```

### Upload Endpoints

#### Upload Single Image
```http
POST /upload/image
Authorization: Bearer {token}
Content-Type: multipart/form-data

File: image.jpg (< 5MB)
```

#### Upload Multiple Images
```http
POST /upload/multiple
Authorization: Bearer {token}
Content-Type: multipart/form-data

Files: image1.jpg, image2.jpg, ... (up to 5 images)
```

### Health & Info

#### Health Check
```http
GET /health
```

Response:
```json
{
  "status": "success",
  "message": "MWG Hostels API is running",
  "database": "connected",
  "timestamp": "2025-10-25T10:30:00Z"
}
```

---

## 🧪 Testing

### Manual API Testing

**Using curl:**
```bash
# Get all hostels
curl https://mwgbysama.vercel.app/api/hostels

# Realtor login
curl -X POST https://mwgbysama.vercel.app/api/realtor-auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass123"}'
```

**Using Postman:**
1. Import API endpoints from collection
2. Set base URL: `https://sama-production-9e28.up.railway.app/api`
3. Test each endpoint

### Frontend Testing

| Page | Test | Status |
|------|------|--------|
| Home | Logo, navigation, hero section | ✅ |
| Hostels | Load, filter, search | ✅ |
| Apply | Form validation, submission | ✅ |
| Login | Email/password validation | ✅ |
| Dashboard | Protected, display user data | ✅ |
| Mobile | Responsive 360×640 | ✅ |
| Tablet | Responsive 768×1024 | ✅ |
| Desktop | Responsive 1440×900 | ✅ |

---

## 🔒 Security

### Features
- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ CORS protection
- ✅ Rate limiting on auth routes
- ✅ Input validation and sanitization
- ✅ XSS protection headers
- ✅ HTTPS enforcement (Vercel/Railway)
- ✅ Environment variable protection
- ✅ Token expiration (24 hours default)

### Best Practices
- Never commit `.env` to Git
- Use strong JWT secret in production
- Enable 2FA for admin accounts
- Monitor failed login attempts
- Regular security audits
- Update dependencies regularly
- Use HTTPS only in production

---

## 📱 Responsive Design

### Breakpoints
```css
Mobile:    360px - 640px   ✅
Tablet:    641px - 1024px  ✅
Desktop:   1025px +        ✅
```

### Features
- Flexible layouts with Flexbox/Grid
- Responsive typography
- Mobile-first approach
- Touch-friendly buttons (44×44px minimum)
- Optimized images for each device
- No horizontal scrolling
- Proper viewport configuration

---

## 🎯 Deployment

### Railway Backend
```bash
# 1. Connect Railway
railway login
railway link

# 2. Deploy
git push  # Auto-deploys on push

# 3. Verify
curl https://sama-production-9e28.up.railway.app/api/health
```

### Vercel Frontend
```bash
# 1. Deploy
vercel --prod

# 2. Verify
# Visit https://mwgbysama.vercel.app/
```

### Environment Setup
1. Set all environment variables in platform dashboards
2. Configure database connection
3. Set up Cloudinary credentials
4. Enable CORS for production domains

---

## 🐛 Troubleshooting

### API Not Responding
- Check backend is running
- Verify API URL in `api-config.js`
- Check network connectivity
- Look at browser console for errors

### Login Not Working
- Verify credentials
- Clear browser cache/cookies
- Check MongoDB connection
- Enable private mode off

### Images Not Uploading
- Check file size (< 5MB)
- Verify Cloudinary credentials
- Check browser console
- Verify image format (JPG, PNG)

### Mobile Issues
- Clear app cache
- Disable incognito mode
- Enable cookies in settings
- Try Chrome browser
- Check viewport meta tag

---

## 📞 Support & Contact

**Report Issues:** Create GitHub issue with:
- Screenshot or video
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/device info

**Email Support:** support@mwghostels.com  
**WhatsApp Support:** +234-XXX-XXX-XXXX  
**Live Chat:** Available on website

---

## 📜 License

MIT License - See LICENSE file for details

---

## 👥 Contributors

- **SAMA GREAT** - Full Stack Developer
- **Contributors Welcome!** - See CONTRIBUTING.md

---

## 🎉 Acknowledgments

- FUTA Community for feedback
- MongoDB for database
- Cloudinary for image hosting
- Railway and Vercel for infrastructure
- All contributors and testers

---

**Platform Status:** ✅ Live and Production Ready  
**Last Updated:** October 25, 2025  
**Version:** 2.1.0

For more information, visit:
- 🌐 Website: https://mwgbysama.vercel.app/
- 📚 Docs: See DEPLOYMENT-GUIDE.md
- ✅ Checklist: See PRODUCTION-READINESS-CHECKLIST.md
