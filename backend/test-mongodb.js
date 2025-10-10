// Quick MongoDB Connection Test
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔄 Attempting to connect to MongoDB...');
console.log('📍 Connection URI:', MONGODB_URI.replace(/:([^:@]{8})[^:@]*@/, ':****@')); // Hide password

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ SUCCESS! Connected to MongoDB Atlas!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌍 Host:', mongoose.connection.host);
    console.log('✨ Your MongoDB setup is working perfectly!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ FAILED! Could not connect to MongoDB');
    console.error('Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('1. Check your .env file has correct MONGODB_URI');
    console.error('2. Verify password is URL-encoded (@ becomes %40)');
    console.error('3. Check Network Access in MongoDB Atlas (use 0.0.0.0/0)');
    console.error('4. Verify database user exists with correct password');
    process.exit(1);
  });
