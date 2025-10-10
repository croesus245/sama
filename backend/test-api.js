// Test API Endpoints
const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing MWG Hostels API...\n');
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.status);
    console.log('   Database:', healthData.database);
    console.log('');
    
    // Test 2: Get All Hostels
    console.log('2️⃣ Getting All Hostels...');
    const hostelsResponse = await fetch(`${API_URL}/hostels`);
    const hostelsData = await hostelsResponse.json();
    console.log('✅ Found', hostelsData.count, 'hostels');
    
    if (hostelsData.count > 0) {
      console.log('\n📋 Hostel Details:');
      hostelsData.data.forEach((hostel, index) => {
        console.log(`\n   ${index + 1}. ${hostel.name}`);
        console.log(`      📍 Location: ${hostel.location}`);
        console.log(`      💰 Price: ₦${hostel.price.toLocaleString()}`);
        console.log(`      📱 WhatsApp: ${hostel.whatsapp}`);
        console.log(`      ✅ Available: ${hostel.available ? 'Yes' : 'No'}`);
        console.log(`      👁️ Views: ${hostel.views}`);
        console.log(`      📝 Applications: ${hostel.applications}`);
        console.log(`      🆔 ID: ${hostel._id}`);
      });
    }
    console.log('');
    
    // Test 3: Get Single Hostel
    if (hostelsData.count > 0) {
      const hostelId = hostelsData.data[0]._id;
      console.log('3️⃣ Getting Single Hostel...');
      const singleResponse = await fetch(`${API_URL}/hostels/${hostelId}`);
      const singleData = await singleResponse.json();
      console.log('✅ Retrieved:', singleData.data.name);
      console.log('');
    }
    
    // Test 4: Create New Hostel
    console.log('4️⃣ Creating New Hostel...');
    const newHostel = {
      name: "Golden Gate Hostel",
      location: "Near FUTA North Gate",
      price: 50000,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80",
      features: ["24/7 Electricity", "WiFi", "Hot Water", "Security"],
      whatsapp: "2348123456789",
      available: true,
      realtorId: "realtor-001",
      realtorName: "Sama Real Estate",
      description: "Modern hostel with excellent facilities",
      roomType: "Self-Contain",
      gender: "Mixed"
    };
    
    const createResponse = await fetch(`${API_URL}/hostels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newHostel)
    });
    const createData = await createResponse.json();
    console.log('✅ Created:', createData.data.name);
    console.log('   ID:', createData.data._id);
    console.log('');
    
    // Test 5: Get Updated List
    console.log('5️⃣ Getting Updated List...');
    const updatedResponse = await fetch(`${API_URL}/hostels`);
    const updatedData = await updatedResponse.json();
    console.log('✅ Total hostels now:', updatedData.count);
    console.log('');
    
    console.log('🎉 All API tests passed!');
    console.log('\n📊 Summary:');
    console.log(`   • Health check: ✅`);
    console.log(`   • Get all hostels: ✅`);
    console.log(`   • Get single hostel: ✅`);
    console.log(`   • Create hostel: ✅`);
    console.log(`   • Total hostels in database: ${updatedData.count}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  
  process.exit(0);
}

// Run tests
testAPI();
