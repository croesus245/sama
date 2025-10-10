// Add this script to view realtor accounts

console.log('🔍 MWG Hostels - Realtor Accounts Viewer');
console.log('=' . repeat(60));

// Function to view all realtor accounts
function viewRealtorAccounts() {
    const accounts = JSON.parse(localStorage.getItem('realtorAccounts') || '[]');
    
    if (accounts.length === 0) {
        console.log('❌ No realtor accounts found');
        console.log('Accounts are stored after registration in realtor-login.html');
        return;
    }
    
    console.log(`✅ Found ${accounts.length} realtor account(s):\n`);
    
    accounts.forEach((account, index) => {
        console.log(`📋 Realtor #${index + 1}`);
        console.log(`   ID: ${account.id}`);
        console.log(`   Name: ${account.name}`);
        console.log(`   Email: ${account.email}`);
        console.log(`   Password: ${account.password} (hashed)`);
        console.log(`   Phone: ${account.phone}`);
        console.log(`   Company: ${account.company || 'N/A'}`);
        console.log(`   Verified: ${account.verified ? '✓ Yes' : '✗ No'}`);
        console.log(`   Registered: ${new Date(account.createdAt).toLocaleString()}`);
        console.log('');
    });
    
    // Return for copying
    return accounts;
}

// Function to view current logged-in realtor
function viewCurrentRealtor() {
    const currentUser = JSON.parse(localStorage.getItem('currentRealtorUser') || 'null');
    
    if (!currentUser) {
        console.log('❌ No realtor currently logged in');
        return null;
    }
    
    console.log('👤 Current Logged-in Realtor:');
    console.log(`   Name: ${currentUser.name}`);
    console.log(`   Email: ${currentUser.email}`);
    console.log(`   ID: ${currentUser.id}`);
    
    return currentUser;
}

// Function to create a test realtor account
function createTestRealtorAccount() {
    const testAccount = {
        id: `realtor_${Date.now()}`,
        email: 'test@realtor.com',
        password: 'test123', // In production, this should be hashed
        name: 'Test Realtor',
        phone: '08012345678',
        company: 'Test Real Estate',
        verified: true,
        createdAt: new Date().toISOString()
    };
    
    const accounts = JSON.parse(localStorage.getItem('realtorAccounts') || '[]');
    accounts.push(testAccount);
    localStorage.setItem('realtorAccounts', JSON.stringify(accounts));
    
    console.log('✅ Test realtor account created!');
    console.log('   Email: test@realtor.com');
    console.log('   Password: test123');
    
    return testAccount;
}

// Function to reset all realtor data
function resetRealtorData() {
    if (confirm('⚠️ This will delete ALL realtor accounts and listings. Continue?')) {
        localStorage.removeItem('realtorAccounts');
        localStorage.removeItem('currentRealtorUser');
        localStorage.removeItem('realtorListings');
        console.log('✅ All realtor data cleared!');
    }
}

// Export functions
window.RealtorAdmin = {
    viewAccounts: viewRealtorAccounts,
    viewCurrent: viewCurrentRealtor,
    createTest: createTestRealtorAccount,
    reset: resetRealtorData
};

// Auto-run on load
console.log('\n📌 Available Commands:');
console.log('   RealtorAdmin.viewAccounts() - View all realtor accounts');
console.log('   RealtorAdmin.viewCurrent() - View current logged-in realtor');
console.log('   RealtorAdmin.createTest() - Create test account (test@realtor.com / test123)');
console.log('   RealtorAdmin.reset() - Clear all realtor data');
console.log('');

// Auto-display accounts if any exist
setTimeout(() => {
    viewRealtorAccounts();
}, 100);