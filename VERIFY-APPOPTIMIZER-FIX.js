/**
 * PRODUCTION VERIFICATION SCRIPT - appOptimizer Fix
 * 
 * This script tests if the appOptimizer fix is working on the deployed frontend.
 * Run this in the browser console on https://mwgbysama.vercel.app/
 * 
 * Expected results:
 * ✅ window.appOptimizer should be defined
 * ✅ Hostels should load from the API
 * ✅ No "Unable to Load Hostels" error
 */

console.log('%c=== MWG HOSTELS - APPOPTIMIZER FIX VERIFICATION ===', 'background: #10b981; color: white; padding: 10px; font-weight: bold; font-size: 16px;');

// TEST 1: Check if appOptimizer is on window
console.group('TEST 1: window.appOptimizer availability');
if (typeof window.appOptimizer !== 'undefined') {
  console.log('✅ PASS: window.appOptimizer is defined');
  console.log('   Type:', typeof window.appOptimizer);
  console.log('   Methods available:', Object.getOwnPropertyNames(Object.getPrototypeOf(window.appOptimizer)));
  
  // Test cache methods
  console.log('\n   Testing cache methods:');
  try {
    window.appOptimizer.cacheSet('test_key', { test: 'value' }, 60000);
    const cached = window.appOptimizer.cacheGet('test_key');
    if (cached) {
      console.log('   ✅ Cache SET/GET working');
    } else {
      console.log('   ⚠️ Cache GET returned null');
    }
  } catch (e) {
    console.log('   ❌ Cache error:', e.message);
  }
} else {
  console.error('❌ FAIL: window.appOptimizer is NOT defined');
  console.error('   The fix may not have been deployed yet.');
}
console.groupEnd();

// TEST 2: Check if HostelAPI is working
console.group('TEST 2: HostelAPI.getAllHostels() execution');
if (typeof HostelAPI !== 'undefined' && typeof HostelAPI.getAllHostels === 'function') {
  console.log('Calling HostelAPI.getAllHostels()...');
  
  HostelAPI.getAllHostels()
    .then(hostels => {
      console.log(`✅ PASS: Retrieved ${hostels ? hostels.length : 0} hostels`);
      if (hostels && hostels.length > 0) {
        console.log('   First hostel:', hostels[0].name || 'N/A');
        console.log('   Sample data:', JSON.stringify(hostels[0], null, 2));
      }
    })
    .catch(error => {
      console.error(`❌ FAIL: API call failed - ${error.message}`);
    });
} else {
  console.error('❌ FAIL: HostelAPI.getAllHostels not available');
}
console.groupEnd();

// TEST 3: Check page state
console.group('TEST 3: Frontend page state');
console.log('DOM ready:', document.readyState);
console.log('Hostels grid element:', document.getElementById('hostelsGrid') ? '✅ Found' : '❌ Not found');

const hostelsGrid = document.getElementById('hostelsGrid');
if (hostelsGrid) {
  const hostelCount = hostelsGrid.querySelectorAll('.hostel-card').length;
  const errorVisible = hostelsGrid.innerHTML.includes('Unable to Load Hostels');
  
  console.log(`Hostel cards rendered: ${hostelCount}`);
  console.log(`Error message visible: ${errorVisible ? '❌ YES (Error shown)' : '✅ NO (No error)'}`);
  
  if (hostelCount > 0 && !errorVisible) {
    console.log('\n✅ SUCCESS: Hostels are displaying on the frontend!');
  } else if (hostelCount === 0 && errorVisible) {
    console.log('\n❌ FAILURE: Frontend still showing error');
  } else if (hostelCount > 0 && errorVisible) {
    console.log('\n⚠️ WARNING: Both hostels and error visible (race condition?)');
  } else {
    console.log('\n❓ Unknown state: No hostels, no error');
  }
}
console.groupEnd();

// TEST 4: API connectivity test
console.group('TEST 4: Direct API connectivity');
(async () => {
  try {
    const response = await fetch('https://sama-production-9e28.up.railway.app/api/hostels', {
      method: 'GET',
      mode: 'cors'
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ API responds with ${data.count} hostels`);
    } else {
      console.error(`❌ API returned status ${response.status}`);
    }
  } catch (error) {
    console.error(`❌ API connectivity failed: ${error.message}`);
  }
})();
console.groupEnd();

console.log('%c=== VERIFICATION COMPLETE ===', 'background: #667eea; color: white; padding: 10px; font-weight: bold;');
console.log('If all tests show ✅, the fix is working correctly!');
