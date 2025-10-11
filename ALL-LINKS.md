# 🔗 MWG HOSTELS - ALL IMPORTANT LINKS

## 🌐 MAIN PLATFORM URL
```
https://mwgbysama.vercel.app
```

---

## 👨‍🎓 STUDENT LINKS

### Student Registration
```
https://mwgbysama.vercel.app/student-register.html
```
📝 Students register here with:
- Full name
- Email
- Matric number
- Phone & WhatsApp
- Department
- Password

### Browse Hostels by Gate
```
https://mwgbysama.vercel.app/hostels.html
```
🏠 Students can:
- View hostels by North Gate, South Gate, West Gate
- See hostel details (price, features, location)
- Contact realtors via WhatsApp
- Save favorite hostels

### Student Login (Coming Soon)
```
https://mwgbysama.vercel.app/student-login.html
```
🔐 Students will login here to:
- View saved hostels
- Track applications
- Manage profile

---

## 🏢 REALTOR LINKS

### Realtor Registration (Application)
```
https://mwgbysama.vercel.app/realtor-register.html
```
📋 Realtors apply here with:
- Full name
- Email
- Phone number
- Business name
- WhatsApp contact
- Password

**Note**: After registration, realtor must wait for admin approval!

### Realtor Login
```
https://mwgbysama.vercel.app/realtor-login-new.html
```
🔑 Realtors login here after approval to:
- Add new hostels
- Edit existing hostels
- Update hostel images (via URL)
- Mark hostels as available/unavailable
- View their hostel listings

### Realtor Dashboard
```
https://mwgbysama.vercel.app/enhanced-realtor-dashboard.html
```
📊 After login, realtors are redirected here to:
- Manage all their hostels
- Add hostel with details (name, location, price, features, image URL)
- Edit hostel information
- Delete hostels
- Update availability status

---

## 👑 ADMIN LINKS

### Admin Login
```
https://mwgbysama.vercel.app/admin-login.html
```
🔐 **Admin Credentials**:
- **Email**: `admin@mwghostels.com`
- **Password**: `Admin@2024`

Admin can:
- View platform statistics
- Approve/reject realtor applications
- View all realtors
- View all hostels
- Suspend realtors
- Manage platform

### Admin Dashboard
```
https://mwgbysama.vercel.app/admin-dashboard.html
```
📈 After login, admin sees:
- Total statistics (students, realtors, hostels)
- Pending realtor applications
- All registered realtors
- All hostel listings
- Approve/reject/suspend controls

### Secret Admin Access (Alternative)
```
https://mwgbysama.vercel.app/404.html
```
🔒 Hidden admin login through 404 page:
1. Go to 404.html
2. Wait for hidden link to appear
3. Click hidden "Admin Access" button
4. Or directly access verification panel below

### Admin Verification Panel (Direct)
```
https://mwgbysama.vercel.app/mwg-verification-panel-2024.html
```
🛡️ Direct admin verification and login

---

## 📄 OTHER IMPORTANT PAGES

### Landing Page (Homepage)
```
https://mwgbysama.vercel.app/index.html
```
🏠 Main homepage with:
- Platform introduction
- Three CTA buttons (Browse Hostels, Student Registration, Realtor Registration)
- Feature highlights
- About section

### Roommate Finder
```
https://mwgbysama.vercel.app/roommate-finder.html
```
👥 Students can find compatible roommates

### Demo Page
```
https://mwgbysama.vercel.app/demo.html
```
🎬 Platform demo and features showcase

---

## 🔧 BACKEND API LINKS

### API Base URL
```
https://sama-production-9e28.up.railway.app/api
```

### Health Check
```
https://sama-production-9e28.up.railway.app/api/health
```
✅ Check if backend is running

### API Documentation
```
https://sama-production-9e28.up.railway.app/api
```
📚 View all available API endpoints

---

## 📱 SPECIFIC WORKFLOW LINKS

### FOR STUDENTS:

#### 1. Register
```
https://mwgbysama.vercel.app/student-register.html
```

#### 2. Browse Hostels
```
https://mwgbysama.vercel.app/hostels.html
```

#### 3. Choose Gate (automatically filters)
- Click "North Gate" → See North Gate hostels
- Click "South Gate" → See South Gate hostels
- Click "West Gate" → See West Gate hostels

#### 4. Contact Realtor
- Click "Contact via WhatsApp" button on any hostel card
- Opens WhatsApp with realtor's number

---

### FOR REALTORS:

#### 1. Register/Apply
```
https://mwgbysama.vercel.app/realtor-register.html
```
📝 Fill application form and submit

#### 2. Wait for Admin Approval
⏳ Admin receives notification and reviews application

#### 3. Login After Approval
```
https://mwgbysama.vercel.app/realtor-login-new.html
```
🔑 Use registered email and password

#### 4. Manage Hostels
```
https://mwgbysama.vercel.app/enhanced-realtor-dashboard.html
```
📊 Add, edit, delete hostels

---

### FOR ADMIN:

#### 1. Login
```
https://mwgbysama.vercel.app/admin-login.html
```
🔐 Use: admin@mwghostels.com / Admin@2024

#### 2. View Dashboard
```
https://mwgbysama.vercel.app/admin-dashboard.html
```
📈 See all platform data

#### 3. Approve Realtor Applications
- Go to "Pending Realtors" section
- Click "Approve" or "Reject" button
- Realtor receives status update

#### 4. Manage Realtors
- View all realtors
- Suspend problematic accounts
- View realtor hostels

---

## 🎯 COMMON USE CASES

### USE CASE 1: Student Looking for Hostel
1. **Start**: https://mwgbysama.vercel.app
2. **Register**: https://mwgbysama.vercel.app/student-register.html
3. **Browse**: https://mwgbysama.vercel.app/hostels.html
4. **Choose Gate**: Click desired gate (North/South/West)
5. **Contact**: Click WhatsApp button on hostel card

---

### USE CASE 2: Realtor Joining Platform
1. **Apply**: https://mwgbysama.vercel.app/realtor-register.html
2. **Wait**: Admin approves application
3. **Login**: https://mwgbysama.vercel.app/realtor-login-new.html
4. **Add Hostel**: Use dashboard to create listing

---

### USE CASE 3: Admin Managing Platform
1. **Login**: https://mwgbysama.vercel.app/admin-login.html
2. **Dashboard**: https://mwgbysama.vercel.app/admin-dashboard.html
3. **Approve Realtors**: Review pending applications
4. **Monitor**: Check statistics and manage users

---

## 📊 API ENDPOINTS

### Student Endpoints:
```
POST /api/students/register          - Register new student
POST /api/students/login             - Student login
GET  /api/students/profile           - Get student profile
POST /api/students/save-hostel/:id   - Save favorite hostel
GET  /api/students/saved-hostels     - Get saved hostels
```

### Realtor Endpoints:
```
POST /api/realtor-auth/register      - Realtor registration
POST /api/realtor-auth/login         - Realtor login
GET  /api/realtor-auth/profile       - Get realtor profile
GET  /api/realtor-auth/verify        - Verify token
```

### Admin Endpoints:
```
POST /api/realtor-auth/admin-login              - Admin login
GET  /api/admin-panel/stats                     - Platform statistics
GET  /api/admin-panel/realtors                  - All realtors
GET  /api/admin-panel/realtors/pending          - Pending applications
PUT  /api/admin-panel/realtors/:id/approve      - Approve realtor
PUT  /api/admin-panel/realtors/:id/reject       - Reject realtor
PUT  /api/admin-panel/realtors/:id/suspend      - Suspend realtor
GET  /api/admin-panel/hostels                   - All hostels
```

### Hostel Endpoints:
```
GET    /api/hostels                  - Get all hostels
GET    /api/hostels/:id              - Get single hostel
POST   /api/hostels                  - Create hostel (realtor only)
PUT    /api/hostels/:id              - Update hostel (realtor only)
DELETE /api/hostels/:id              - Delete hostel (realtor only)
GET    /api/hostels/realtor/:id      - Get realtor's hostels
```

---

## 📱 SHAREABLE LINKS

### Share with Students:
```
📱 Browse Hostels: https://mwgbysama.vercel.app/hostels.html
📝 Register: https://mwgbysama.vercel.app/student-register.html
```

### Share with Realtors:
```
📋 Apply as Realtor: https://mwgbysama.vercel.app/realtor-register.html
🔑 Realtor Login: https://mwgbysama.vercel.app/realtor-login-new.html
```

### Admin Access:
```
🔐 Admin Login: https://mwgbysama.vercel.app/admin-login.html
```

---

## 🔗 QUICK ACCESS LINKS

### Main Entry Points:
| Purpose | URL |
|---------|-----|
| Homepage | https://mwgbysama.vercel.app |
| Student Registration | https://mwgbysama.vercel.app/student-register.html |
| Browse Hostels | https://mwgbysama.vercel.app/hostels.html |
| Realtor Application | https://mwgbysama.vercel.app/realtor-register.html |
| Realtor Login | https://mwgbysama.vercel.app/realtor-login-new.html |
| Admin Login | https://mwgbysama.vercel.app/admin-login.html |

---

## 🎯 TESTING LINKS

### Test Student Flow:
1. Register: https://mwgbysama.vercel.app/student-register.html
2. Browse: https://mwgbysama.vercel.app/hostels.html
3. Select gate and view hostels

### Test Realtor Flow:
1. Register: https://mwgbysama.vercel.app/realtor-register.html
2. Admin approves (login at admin-login.html)
3. Login: https://mwgbysama.vercel.app/realtor-login-new.html
4. Add hostel in dashboard

### Test Admin Flow:
1. Login: https://mwgbysama.vercel.app/admin-login.html
2. View stats and pending realtors
3. Approve/reject applications

---

## 📲 MOBILE ACCESS

All links work perfectly on mobile devices! Just share the URLs and users can access on their phones.

---

## 🆘 SUPPORT LINKS

### Dashboards:
- **Vercel**: https://vercel.com/dashboard
- **Railway**: https://railway.app/dashboard
- **MongoDB**: https://cloud.mongodb.com
- **GitHub**: https://github.com/croesus245/sama

### Backend Health:
- **API Health**: https://sama-production-9e28.up.railway.app/api/health
- **API Info**: https://sama-production-9e28.up.railway.app/api

---

## 🎉 SUMMARY

### 🔑 MOST IMPORTANT LINKS:

1. **Main Platform**: https://mwgbysama.vercel.app
2. **Student Register**: https://mwgbysama.vercel.app/student-register.html
3. **Browse Hostels**: https://mwgbysama.vercel.app/hostels.html
4. **Realtor Apply**: https://mwgbysama.vercel.app/realtor-register.html
5. **Realtor Login**: https://mwgbysama.vercel.app/realtor-login-new.html
6. **Admin Login**: https://mwgbysama.vercel.app/admin-login.html

---

**Platform Status**: ✅ LIVE  
**Backend Status**: ✅ RUNNING  
**Database Status**: ✅ CONNECTED

**Share your platform**: https://mwgbysama.vercel.app 🚀
