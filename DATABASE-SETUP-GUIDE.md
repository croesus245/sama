# 🗄️ Database Setup Guide - MongoDB Atlas (Free Tier)

## ⚡ **Quick Setup (5 minutes)**

### **Step 1: Create MongoDB Atlas Account**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Click "Try Free" 
3. Sign up with email or Google account

### **Step 2: Create Free Cluster**
1. Choose **"Shared Clusters"** (Free tier)
2. Select **AWS** provider
3. Choose region closest to your users (e.g., US East, Europe, Asia)
4. Cluster Name: `mwg-hostels-cluster`
5. Click **"Create Cluster"** (takes 3-5 minutes)

### **Step 3: Configure Database Access**
1. In left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Create user:
   - **Username**: `mwg_admin`
   - **Password**: Generate strong password (save it!)
   - **Database User Privileges**: Read and write to any database
4. Click **"Add User"**

### **Step 4: Configure Network Access**
1. In left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. For development: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. For production: Add your server's specific IP address
5. Click **"Confirm"**

### **Step 5: Get Connection String**
1. Go to **"Clusters"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **4.1 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://mwg_admin:<password>@mwg-hostels-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### **Step 6: Update .env File**
1. Open `backend/.env` file
2. Replace the MONGODB_URI line:
   ```env
   # Replace this line:
   MONGODB_URI=mongodb://localhost:27017/mwg_hostels
   
   # With your Atlas connection string:
   MONGODB_URI=mongodb+srv://mwg_admin:YOUR_PASSWORD@mwg-hostels-cluster.xxxxx.mongodb.net/mwg_hostels?retryWrites=true&w=majority
   ```
3. Replace `<password>` with your actual password
4. Add database name `mwg_hostels` before the `?` in the URL

### **Step 7: Test Connection**
1. Save the .env file
2. Restart your backend server:
   ```bash
   # Stop current server (Ctrl+C)
   # Then restart:
   cd backend
   node server.js
   ```
3. Look for success message:
   ```
   ✅ Connected to MongoDB Atlas
   🚀 MWG Hostels API Server running on port 5000
   ```

## 🎯 **Complete .env Example**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration - MongoDB Atlas
MONGODB_URI=mongodb+srv://mwg_admin:SuperSecurePassword123@mwg-hostels-cluster.abcde.mongodb.net/mwg_hostels?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=a9b07c4f9312a16d223621f6d2fe23d5d0192789115e5d860256303293a5715ed542196170a286131fd3834fe38c6d06fd8341068ea1a993d46e04710aa4cb58
JWT_EXPIRE=7d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your.email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@mwghostels.com
```

## 🔒 **Security Best Practices**

### **For Production**
1. **IP Whitelist**: Only allow your server's IP address
2. **Strong Password**: Use 20+ character password with symbols
3. **Environment Variables**: Never commit .env files to Git
4. **Database User**: Create separate users for different environments

### **Backup Strategy**
```javascript
// Add to backend/scripts/backup.js
const schedule = require('node-cron');

// Daily backup at 2 AM
schedule.schedule('0 2 * * *', async () => {
    console.log('Starting daily backup...');
    // MongoDB Atlas automatically backs up data
    // You can also implement custom backup logic here
});
```

## 📊 **Database Scaling**

### **Free Tier Limits**
- **Storage**: 512 MB
- **RAM**: Shared (good for ~1,000 users)
- **Connections**: 100 concurrent
- **Bandwidth**: No limit

### **When to Upgrade**
- **M2 ($9/month)**: 2GB storage, 500 connections (5,000+ users)
- **M5 ($25/month)**: 5GB storage, 1,500 connections (15,000+ users)
- **M10 ($57/month)**: 10GB storage, 3,000 connections (50,000+ users)

## 🚨 **Troubleshooting**

### **Common Issues**

#### **"Authentication failed"**
```
Solution: Check username/password in connection string
```

#### **"Network timeout"**
```
Solution: Add IP address to Network Access whitelist
```

#### **"Database not found"**
```
Solution: Make sure database name is in connection string
Example: .../mwg_hostels?retryWrites=true...
```

#### **"Too many connections"**
```
Solution: Upgrade tier or optimize connection pooling
```

### **Test Connection Script**
Create `backend/test-db.js`:
```javascript
require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Database connection successful!');
        
        // Test basic operations
        const testDoc = await mongoose.connection.db.collection('test').insertOne({
            message: 'Hello from MWG Hostels!',
            timestamp: new Date()
        });
        
        console.log('✅ Database write test successful!');
        
        await mongoose.connection.db.collection('test').deleteOne({
            _id: testDoc.insertedId
        });
        
        console.log('✅ Database delete test successful!');
        
        mongoose.connection.close();
        console.log('🎉 All database tests passed!');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }
}

testConnection();
```

Run test:
```bash
cd backend
node test-db.js
```

## 🌟 **Advanced Configuration**

### **Connection Pooling**
```javascript
// In backend/config/database.js
const mongoOptions = {
    maxPoolSize: 10,        // Maximum number of connections
    serverSelectionTimeoutMS: 5000,  // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000,          // Close connections after 45 seconds of inactivity
    bufferMaxEntries: 0,             // Disable mongoose buffering
    bufferCommands: false,           // Disable mongoose buffering
};

mongoose.connect(process.env.MONGODB_URI, mongoOptions);
```

### **Indexes for Performance**
```javascript
// Add to backend/models/User.js
userSchema.index({ email: 1 });           // Email lookups
userSchema.index({ university: 1 });      // University filtering
userSchema.index({ createdAt: -1 });      // Recent users first

// Add to backend/models/Property.js
propertySchema.index({ location: '2dsphere' });  // Geospatial queries
propertySchema.index({ price: 1 });               // Price filtering
propertySchema.index({ 'tags': 1 });              // Tag-based search
```

## 🎉 **Success Checklist**

- [ ] MongoDB Atlas account created
- [ ] Free cluster deployed
- [ ] Database user configured
- [ ] Network access allowed
- [ ] Connection string copied
- [ ] .env file updated
- [ ] Backend server restarted
- [ ] Connection success message seen
- [ ] Registration form works
- [ ] Data persists after server restart

**Your database is now production-ready and can scale to thousands of users!** 🚀