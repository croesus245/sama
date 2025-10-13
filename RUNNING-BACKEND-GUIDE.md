# 🚀 Running Backend with Application Routes - Quick Guide

## ✅ Backend is Now Running!

Your backend server is **LIVE** on `http://localhost:5000` with **application routes enabled**.

---

## 📋 How to Start the Backend (3 Ways)

### Method 1: PowerShell (Recommended for Development)
```powershell
cd C:\Users\croes\Desktop\sama\backend
node simple-server.js
```

### Method 2: Background Process (Stays Running)
```powershell
cd C:\Users\croes\Desktop\sama\backend
Start-Process -NoNewWindow node -ArgumentList "simple-server.js"
```

### Method 3: Using npm (if you have scripts set up)
```powershell
cd C:\Users\croes\Desktop\sama\backend
npm start
```

---

## 🔍 Verify Application Routes are Working

### Test 1: Health Check
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing
```

### Test 2: Check All Endpoints
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api" -UseBasicParsing | ConvertFrom-Json
```

### Test 3: Test Application Submit Endpoint
```powershell
$testData = @{
    applicationData = @{
        applicationId = "APP-TEST-123"
        hostelId = "68ed40ad323b624a32f6e05f"
        studentInfo = @{
            firstName = "Test"
            lastName = "Student"
            email = "test@example.com"
            phone = "+2348012345678"
            studentId = "2024123456"
            level = "300"
            department = "Computer Science"
        }
        accommodation = @{
            roomType = "shared"
            moveInDate = "2025-01-01"
            duration = "semester"
        }
        additional = @{
            emergencyContact = "Parent Name - +2348098765432"
            paymentMethod = "bank_transfer"
        }
    }
} | ConvertTo-Json -Depth 5

Invoke-WebRequest -Uri "http://localhost:5000/api/applications/submit" -Method POST -Body $testData -ContentType "application/json" | ConvertFrom-Json
```

---

## 🎯 Available Application Endpoints

### Submit Application
- **URL**: `/api/applications/submit`
- **Method**: POST
- **Purpose**: Submit new hostel application

### Get Student Applications
- **URL**: `/api/applications/student/:email`
- **Method**: GET
- **Purpose**: Get all applications by student email

### Get Realtor Applications
- **URL**: `/api/applications/realtor/:realtorId`
- **Method**: GET
- **Purpose**: Get all applications for a realtor

### Update Application Status
- **URL**: `/api/applications/:id/status`
- **Method**: PATCH
- **Purpose**: Update application status (pending, approved, rejected)

### Add Message to Application
- **URL**: `/api/applications/:id/message`
- **Method**: POST
- **Purpose**: Add message/note to application

### Cancel Application
- **URL**: `/api/applications/:id`
- **Method**: DELETE
- **Purpose**: Cancel/delete application

### Get Application Statistics
- **URL**: `/api/applications/stats`
- **Method**: GET
- **Purpose**: Get overall application statistics

---

## 🧪 Test the Complete Flow

### Step 1: Start Backend
```powershell
cd C:\Users\croes\Desktop\sama\backend
node simple-server.js
```

You should see:
```
🚀 Server running on port 5000
✅ Connected to MongoDB Atlas
📊 Database: mwg-hostels
```

### Step 2: Test Application Form
1. Open: http://localhost:8000/apply.html?hostelId=68ed40ad323b624a32f6e05f
2. Fill out the form with test data
3. Submit the application
4. You should see success message with Application ID
5. Click the WhatsApp button to verify the pre-filled message

### Step 3: Check Database
1. Login to MongoDB Atlas
2. Go to your `mwg-hostels` database
3. Check the `applications` collection
4. You should see your test application saved

---

## 🛑 Stop the Backend

### If running in terminal (Method 1):
Press `Ctrl + C`

### If running as background process (Method 2):
```powershell
Get-Process -Name node | Stop-Process -Force
```

---

## 🔄 Restart Backend (After Code Changes)

```powershell
# Stop
Get-Process -Name node | Stop-Process -Force

# Start
cd C:\Users\croes\Desktop\sama\backend
node simple-server.js
```

---

## 📊 Monitor Backend Logs

When the backend is running in the terminal, you'll see:
- ✅ Application submissions
- ❌ Errors (if any)
- 📝 Database operations
- 🔍 API requests

Example output:
```
✅ Application submitted: APP-1728847234567-ABC123XYZ
📧 Student: john.doe@example.com
🏠 Hostel: sama d great
```

---

## 🆘 Troubleshooting

### Issue: Port 5000 already in use
```powershell
# Find process using port 5000
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess

# Stop it
Stop-Process -Id <ProcessId> -Force
```

### Issue: MongoDB connection error
- Check your `.env` file has correct `MONGODB_URI`
- Verify MongoDB Atlas allows your IP address
- Check internet connection

### Issue: Application routes not found
- Make sure `simple-server.js` includes:
  ```javascript
  const applicationRoutes = require('./routes/applications');
  app.use('/api/applications', applicationRoutes);
  ```

---

## ✅ Current Status

- **Backend**: ✅ Running on http://localhost:5000
- **Database**: ✅ Connected to MongoDB Atlas
- **Application Routes**: ✅ Loaded and ready
- **Frontend**: Running on http://localhost:8000

---

## 🎉 You're Ready!

The backend is now running with all application routes enabled. You can:

1. **Test locally**: Use the form at http://localhost:8000/apply.html
2. **Submit applications**: All data saves to MongoDB Atlas
3. **Track applications**: Use http://localhost:8000/my-applications.html
4. **Use WhatsApp**: Contact button works after submission

---

**Next Step**: Test the complete flow by submitting a real application! 🚀

**Server Status**: ✅ **RUNNING** on http://localhost:5000
