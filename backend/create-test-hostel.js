// Create Test Hostel in MongoDB
require('dotenv').config();
const mongoose = require('mongoose');

// Define Hostel Schema
const hostelSchema = new mongoose.Schema({
  name: String,
  location: String,
  price: Number,
  image: String,
  features: [String],
  whatsapp: String,
  available: Boolean,
  realtorId: String,
  applications: Number
}, { timestamps: true });

const Hostel = mongoose.model('Hostel', hostelSchema);

// Connect and create test hostel
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Create a test hostel
    const testHostel = new Hostel({
      name: "Peace Palace Hostel",
      location: "Behind FUTA South Gate",
      price: 45000,
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80",
      features: ["WiFi", "Security", "Water Supply"],
      whatsapp: "2348145653433",
      available: true,
      realtorId: "test-realtor-001",
      applications: 0
    });
    
    await testHostel.save();
    console.log('✅ Test hostel created:', testHostel.name);
    
    // View all hostels
    const allHostels = await Hostel.find();
    console.log(`📊 Total hostels in database: ${allHostels.length}`);
    console.log('Hostels:', allHostels);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
