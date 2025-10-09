// Quick setup script to add sample hostels for immediate testing

// Sample hostels data
const sampleHostels = [
    {
        id: 'hostel_sample_1',
        name: 'Premium Student Lodge',
        location: 'North Gate',
        price: 45000,
        pricePeriod: 'semester',
        capacity: 2,
        address: 'Block A, North Gate Area, Near FUTA Main Entrance',
        description: 'Modern hostel with excellent facilities, 24/7 security, and reliable power supply. Perfect for serious students.',
        amenities: ['WiFi', 'Security', 'Generator', 'Kitchen', 'Study Room'],
        phone: '08123456789',
        whatsapp: '08123456789',
        images: [
            'https://images.unsplash.com/photo-1555854877-bab0e921b58d?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
        ],
        status: 'available',
        views: 45,
        inquiries: 8,
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        realtorId: 'admin@mwghostels.com',
        verified: true,
        realtorInfo: {
            fullName: 'Administrator',
            brandName: 'MWG Premium Properties',
            email: 'admin@mwghostels.com'
        }
    },
    {
        id: 'hostel_sample_2',
        name: 'Comfort Palace',
        location: 'South Gate',
        price: 38000,
        pricePeriod: 'semester',
        capacity: 3,
        address: 'House 15, South Gate Road, Akure',
        description: 'Affordable and comfortable accommodation with all basic amenities. Great for budget-conscious students.',
        amenities: ['WiFi', 'Security', 'Kitchen', 'Parking'],
        phone: '08134567890',
        whatsapp: '08134567890',
        images: [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
        ],
        status: 'available',
        views: 32,
        inquiries: 5,
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        realtorId: 'admin@mwghostels.com',
        verified: true,
        realtorInfo: {
            fullName: 'Administrator',
            brandName: 'MWG Premium Properties',
            email: 'admin@mwghostels.com'
        }
    },
    {
        id: 'hostel_sample_3',
        name: 'Executive Suites',
        location: 'Main Campus',
        price: 65000,
        pricePeriod: 'semester',
        capacity: 1,
        address: 'Complex B, Main Campus Area, FUTA',
        description: 'Luxury accommodation for students who want the best. Private rooms with en-suite bathrooms and premium facilities.',
        amenities: ['WiFi', 'Security', 'Generator', 'AC', 'Kitchen', 'Study Room', 'Gym'],
        phone: '08145678901',
        whatsapp: '08145678901',
        images: [
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'
        ],
        status: 'available',
        views: 67,
        inquiries: 12,
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        realtorId: 'admin@mwghostels.com',
        verified: true,
        realtorInfo: {
            fullName: 'Administrator',
            brandName: 'MWG Premium Properties',
            email: 'admin@mwghostels.com'
        }
    }
];

// Function to initialize sample data
function initializeSampleHostels() {
    try {
        // Check if hostels already exist
        const existing = localStorage.getItem('realtorHostels');
        if (existing && JSON.parse(existing).length > 0) {
            console.log('✅ Hostels already exist, skipping initialization');
            return;
        }
        
        // Save sample hostels
        localStorage.setItem('realtorHostels', JSON.stringify(sampleHostels));
        
        // Also save to student format for compatibility
        const studentFormat = sampleHostels.map(hostel => ({
            id: hostel.id,
            name: hostel.name,
            location: hostel.location,
            price: hostel.price,
            images: hostel.images,
            realtorInfo: hostel.realtorInfo,
            phone: hostel.phone,
            whatsapp: hostel.whatsapp,
            status: 'active',
            capacity: hostel.capacity,
            description: hostel.description,
            amenities: hostel.amenities,
            address: hostel.address,
            views: hostel.views,
            inquiries: hostel.inquiries,
            dateAdded: hostel.dateAdded,
            lastUpdated: hostel.lastUpdated
        }));
        
        localStorage.setItem('realtorListings', JSON.stringify(studentFormat));
        
        console.log('✅ Sample hostels initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Error initializing sample hostels:', error);
        return false;
    }
}

// Auto-initialize when script is loaded
console.log('🔄 Checking for existing hostels...');
initializeSampleHostels();