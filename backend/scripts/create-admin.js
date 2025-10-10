// Create Default Admin Account
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const createDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@mwghostels.com' });

    if (existingAdmin) {
      console.log('ℹ️  Default admin already exists');
      console.log('📧 Email: admin@mwghostels.com');
      console.log('👤 Name:', existingAdmin.fullName);
      console.log('🔑 Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create default admin
    const admin = new Admin({
      email: 'admin@mwghostels.com',
      password: 'Admin@12345', // Change this after first login!
      fullName: 'MWG Admin',
      role: 'super-admin'
    });

    await admin.save();

    console.log('');
    console.log('✅ Default admin account created successfully!');
    console.log('');
    console.log('=' .repeat(50));
    console.log('📋 ADMIN CREDENTIALS');
    console.log('=' .repeat(50));
    console.log('📧 Email:    admin@mwghostels.com');
    console.log('🔑 Password: Admin@12345');
    console.log('👤 Name:     MWG Admin');
    console.log('🎖️  Role:     super-admin');
    console.log('=' .repeat(50));
    console.log('');
    console.log('⚠️  IMPORTANT: Please change the password after first login!');
    console.log('');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

// Run the script
createDefaultAdmin();
