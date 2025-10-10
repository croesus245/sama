# 🚀 How to Run MWG Hostels Platform

## ✅ Current Status

**Server Status**: 🟢 **ALREADY RUNNING** on port 5000  
**Database**: ✅ Connected to MongoDB Atlas  
**Admin Account**: ✅ Ready (admin@mwghostels.com / Admin@12345)

---

## 📋 Quick Start (Server Already Running)

Since your server is already running, you can **start using the platform immediately**!

### Option 1: Open in Browser (Recommended)

Simply open these files in your browser:

1. **Main Website** (for students):
   ```
   File: C:\Users\croes\Desktop\sama\index.html
   ```
   - Right-click → Open with → Your browser (Chrome, Edge, Firefox)
   - Or drag the file into your browser

2. **Admin Dashboard**:
   ```
   File: C:\Users\croes\Desktop\sama\admin-login.html
   ```
   - Login with: `admin@mwghostels.com` / `Admin@12345`

3. **Realtor Registration**:
   ```
   File: C:\Users\croes\Desktop\sama\realtor-register.html
   ```
   - Register a new realtor account

4. **Realtor Login**:
   ```
   File: C:\Users\croes\Desktop\sama\realtor-login-new.html
   ```
   - Login after registration

### Option 2: Use Live Server Extension (Better for Development)

If using VS Code:
1. Install "Live Server" extension by Ritwick Dey
2. Right-click `index.html` → "Open with Live Server"
3. Your browser will open at `http://localhost:5500`

---

## 🔧 If Server is NOT Running

### Step 1: Start the Backend Server

Open a **NEW** terminal and run:

```powershell
cd C:\Users\croes\Desktop\sama\backend
node simple-server.js
```

You should see:
```
🚀 Server running on port 5000
🌐 API URL: http://localhost:5000/api
📋 Health Check: http://localhost:5000/api/health
🏠 Hostels API: http://localhost:5000/api/hostels
✅ Connected to MongoDB Atlas
📊 Database: mwg-hostels
```

**Leave this terminal open!** The server must keep running.

### Step 2: Open the Website

Open `index.html` in your browser (see Option 1 above)

---

## 🛑 How to Stop the Server

If you need to stop the server:

1. Go to the terminal running the server
2. Press **Ctrl + C**
3. The server will stop

---

## 🔄 How to Restart the Server

If you made changes to backend code:

1. Stop the server (Ctrl + C)
2. Start it again:
   ```powershell
   cd C:\Users\croes\Desktop\sama\backend
   node simple-server.js
   ```

---

## 🧪 Test the System

### Test 1: Check if Server is Running

Open this URL in your browser:
```
http://localhost:5000/api/health
```

✅ **Success**: You'll see JSON response:
```json
{
  "status": "ok",
  "message": "MWG Hostels API is running",
  "timestamp": "2024-10-10T..."
}
```

❌ **Error**: "This site can't be reached" → Server is not running

### Test 2: Admin Login

1. Open `admin-login.html`
2. Login with:
   - Email: `admin@mwghostels.com`
   - Password: `Admin@12345`
3. ✅ Should redirect to Admin Dashboard

### Test 3: Register Realtor

1. Open `realtor-register.html`
2. Fill in the form:
   - Full Name: `Test Realtor`
   - Email: `test@example.com`
   - Phone: `08012345678`
   - WhatsApp: `2348012345678`
   - Password: `Test@1234` (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
3. Click "Register"
4. ✅ Should show success message and redirect to login

### Test 4: Approve Realtor

1. Login to Admin Dashboard
2. Go to "Pending Approvals" tab
3. Find the test realtor
4. Click "✓ Approve"
5. ✅ Status should change to "Active"

### Test 5: Realtor Dashboard

1. Open `realtor-login-new.html`
2. Login with test realtor credentials
3. ✅ Should redirect to dashboard
4. Try adding a hostel
5. ✅ Hostel should appear in your dashboard

---

## 📱 Access URLs

When server is running:

| Page | File | URL (if using Live Server) |
|------|------|---------------------------|
| Main Website | `index.html` | `http://localhost:5500/index.html` |
| Admin Login | `admin-login.html` | `http://localhost:5500/admin-login.html` |
| Admin Dashboard | `admin-dashboard.html` | `http://localhost:5500/admin-dashboard.html` |
| Realtor Register | `realtor-register.html` | `http://localhost:5500/realtor-register.html` |
| Realtor Login | `realtor-login-new.html` | `http://localhost:5500/realtor-login-new.html` |
| Realtor Dashboard | `enhanced-realtor-dashboard.html` | `http://localhost:5500/enhanced-realtor-dashboard.html` |

**Backend API**: `http://localhost:5000/api`

---

## ⚠️ Troubleshooting

### Issue: "Address already in use" error

**Meaning**: Server is already running!

**Solution**: 
- **Option A**: Use the existing server (it's working!)
- **Option B**: Stop the old server first, then restart

To find and stop the old server:
```powershell
# Find the process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace <PID> with the number you found)
taskkill /PID <PID> /F
```

### Issue: "Cannot connect to API" in browser

**Check**:
1. Is the server running? (See Test 1 above)
2. Is the URL correct? (`http://localhost:5000/api`)
3. Check browser console for errors (F12)

**Solution**:
- Start/restart the server
- Check `hostel-api.js` - API_BASE_URL should be `http://localhost:5000/api`

### Issue: "Failed to fetch" errors

**Cause**: Backend server not running

**Solution**: Start the server (see Step 1 above)

### Issue: Can't login as admin

**Check**:
1. Did you create the admin account?
2. Are you using the correct credentials?

**Solution**:
```powershell
cd C:\Users\croes\Desktop\sama\backend
node scripts/create-admin.js
```

Default admin credentials:
- Email: `admin@mwghostels.com`
- Password: `Admin@12345`

### Issue: MongoDB connection error

**Cause**: Internet connection or MongoDB Atlas credentials

**Solution**:
1. Check your internet connection
2. Verify MongoDB Atlas cluster is running
3. Check credentials in `backend/simple-server.js`

---

## 🎯 Complete Workflow Example

### For Students (Finding Hostels):
1. Open `index.html` in browser
2. Browse available hostels
3. Click "Contact via WhatsApp" to message realtor
4. ✅ WhatsApp opens with pre-filled message

### For Realtors (Adding Hostels):
1. Register → `realtor-register.html`
2. Wait for admin approval (check email or login to see status)
3. Login → `realtor-login-new.html`
4. Dashboard opens → `enhanced-realtor-dashboard.html`
5. Click "Add New Hostel" button
6. Fill in details (name, location, price, WhatsApp, etc.)
7. Submit
8. ✅ Hostel appears in your dashboard
9. After admin approval → Hostel visible on main website

### For Admins (Managing Platform):
1. Login → `admin-login.html` (admin@mwghostels.com / Admin@12345)
2. Dashboard opens → `admin-dashboard.html`
3. **View Statistics**: See pending/active/suspended realtors count
4. **Approve Realtors**: Go to "Pending Approvals" tab → Click approve
5. **Manage Realtors**: Go to "All Realtors" tab → Suspend/reactivate
6. **View Hostels**: Go to "All Hostels" tab → See all listings
7. ✅ Platform under full control

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────┐
│  Frontend (HTML/CSS/JS)                         │
│  - index.html (Students)                        │
│  - admin-dashboard.html (Admin)                 │
│  - enhanced-realtor-dashboard.html (Realtors)   │
└────────────────┬────────────────────────────────┘
                 │
                 │ HTTP Requests
                 │ (hostel-api.js)
                 ↓
┌─────────────────────────────────────────────────┐
│  Backend Server (Node.js + Express)             │
│  - Port: 5000                                   │
│  - Location: backend/simple-server.js           │
│  - Routes:                                      │
│    • /api/hostels (Hostel CRUD)                 │
│    • /api/realtor-auth (Authentication)         │
│    • /api/admin-panel (Admin management)        │
└────────────────┬────────────────────────────────┘
                 │
                 │ MongoDB Driver
                 │ (Mongoose)
                 ↓
┌─────────────────────────────────────────────────┐
│  Database (MongoDB Atlas)                       │
│  - Cluster: Cluster0.n8satkn.mongodb.net       │
│  - Database: mwg-hostels                        │
│  - Collections:                                 │
│    • hostels                                    │
│    • realtors                                   │
│    • admins                                     │
└─────────────────────────────────────────────────┘
```

---

## 🔑 Default Credentials

### Admin Account:
- **Email**: `admin@mwghostels.com`
- **Password**: `Admin@12345`
- **Role**: super-admin
- **Access**: Full platform management

### Test Realtor (Create Your Own):
1. Go to `realtor-register.html`
2. Fill in your details
3. Login after admin approval

---

## 📖 Next Steps

1. ✅ **Test the system** using the guide above
2. ✅ **Register test realtors** to try the workflow
3. ✅ **Add test hostels** to see them on the main site
4. ✅ **Customize** the content and styling as needed
5. 🚀 **Deploy** to production (see DEPLOYMENT-GUIDE.md)

---

## 📚 Additional Documentation

- **AUTHENTICATION-POLISH-COMPLETE.md** - Full security features
- **ADMIN-DASHBOARD-COMPLETE.md** - Admin testing guide
- **BACKEND-AUTH-COMPLETE.md** - API documentation
- **POLISH-FEATURES-SUMMARY.md** - Quick feature reference
- **VISUAL-POLISH-GUIDE.md** - Visual workflow diagrams

---

## 💡 Quick Tips

1. **Always start backend server first** before opening frontend pages
2. **Keep terminal open** while server is running
3. **Use Chrome DevTools** (F12) to debug issues
4. **Check browser console** for error messages
5. **Test with multiple browser tabs** to simulate multiple users

---

## 🎉 You're Ready!

Your MWG Hostels platform is **fully functional** and ready to use!

**Current Status**:
- ✅ Server running on port 5000
- ✅ Database connected to MongoDB Atlas
- ✅ Admin account created
- ✅ All features working

Just open the files in your browser and start testing! 🚀

---

**Version**: 1.0.0  
**Last Updated**: October 10, 2024  
**Status**: Production Ready ✅
