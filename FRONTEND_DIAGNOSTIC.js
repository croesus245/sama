/**
 * PRODUCTION FRONTEND DEBUGGING - Deep Diagnostic
 * This script will be embedded in index.html to diagnose the "Unable to Load Hostels" error
 * 
 * Run this from browser console on https://mwgbysama.vercel.app/
 */

console.log('%c=== MWG HOSTELS - PRODUCTION DIAGNOSTIC START ===', 'background: #ff6b6b; color: white; padding: 10px; font-weight: bold;');

// STEP 1: Check if hostel-api.js loaded
console.group('STEP 1: Checking hostel-api.js loading');
console.log('typeof HostelAPI:', typeof HostelAPI);
console.log('typeof fetchWithRetry:', typeof fetchWithRetry);
console.log('API_BASE_URL:', typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'NOT DEFINED');
if (typeof HostelAPI === 'undefined') {
  console.error('❌ CRITICAL: HostelAPI not defined - script likely failed to load');
} else {
  console.log('✅ HostelAPI is available');
}
console.groupEnd();

// STEP 2: Check if appOptimizer loaded
console.group('STEP 2: Checking appOptimizer availability');
console.log('typeof window.appOptimizer:', typeof window.appOptimizer);
if (typeof window.appOptimizer !== 'undefined') {
  console.log('✅ appOptimizer available for caching');
  console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(window.appOptimizer)));
} else {
  console.warn('⚠️ appOptimizer not loaded - caching will fail gracefully');
}
console.groupEnd();

// STEP 3: Test direct API call to production backend
console.group('STEP 3: Direct API Call Test');
(async () => {
  const apiUrl = 'https://sama-production-9e28.up.railway.app/api/hostels';
  console.log(`Testing: ${apiUrl}`);
  
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      credentials: 'omit'
    });
    
    console.log(`✅ Response received - Status: ${response.status} ${response.statusText}`);
    console.log(`Headers:`, {
      'Content-Type': response.headers.get('Content-Type'),
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin')
    });
    
    const data = await response.json();
    console.log(`✅ JSON parsed successfully`);
    console.log(`Response data:`, data);
    
    if (data.success && data.data) {
      console.log(`✅ API returned ${data.count} hostels`);
    }
    
  } catch (error) {
    console.error(`❌ Direct API call failed:`, error.message);
    console.error(`Error type:`, error.constructor.name);
    console.error(`Full error:`, error);
  }
})();
console.groupEnd();

// STEP 4: Test HostelAPI.getAllHostels() if available
console.group('STEP 4: HostelAPI.getAllHostels() Test');
if (typeof HostelAPI !== 'undefined' && typeof HostelAPI.getAllHostels === 'function') {
  (async () => {
    try {
      console.log('Calling HostelAPI.getAllHostels()...');
      const hostels = await HostelAPI.getAllHostels();
      console.log(`✅ getAllHostels() succeeded`);
      console.log(`Received ${hostels ? hostels.length : 0} hostels`);
      console.log('Sample:', hostels && hostels[0] ? hostels[0] : 'No data');
    } catch (error) {
      console.error(`❌ getAllHostels() failed:`, error.message);
      console.error(`Full error:`, error);
    }
  })();
} else {
  console.error('❌ HostelAPI.getAllHostels is not callable');
}
console.groupEnd();

// STEP 5: Check localStorage for cached data
console.group('STEP 5: LocalStorage Cache Check');
const cacheKeys = Object.keys(localStorage).filter(k => k.includes('cache') || k.includes('hostel'));
console.log('Cache keys found:', cacheKeys);
cacheKeys.forEach(key => {
  const value = localStorage.getItem(key);
  console.log(`${key}:`, value ? `${value.substring(0, 100)}...` : 'empty');
});
console.groupEnd();

// STEP 6: Monitor page loading
console.group('STEP 6: DOM Readiness State');
console.log('document.readyState:', document.readyState);
console.log('DOMContentLoaded fired:', typeof window._DOMContentLoadedFired !== 'undefined' ? '✅ Yes' : '❌ No');

// Check if loadAndDisplayHostels was called
console.log('typeof loadAndDisplayHostels:', typeof loadAndDisplayHostels);
console.log('typeof displayHostels:', typeof displayHostels);
console.log('typeof filterHostelsByLocation:', typeof filterHostelsByLocation);
console.groupEnd();

// STEP 7: Check for errors in console history
console.group('STEP 7: Previous Errors');
console.log('Check browser console for any red errors');
console.groupEnd();

// STEP 8: Simulate loadAndDisplayHostels manually
console.group('STEP 8: Manual Test - loadAndDisplayHostels');
console.log('Calling loadAndDisplayHostels() manually...');
if (typeof loadAndDisplayHostels === 'function') {
  loadAndDisplayHostels().then(() => {
    console.log('✅ loadAndDisplayHostels() completed');
  }).catch(error => {
    console.error('❌ loadAndDisplayHostels() threw error:', error.message);
    console.error('Full error:', error);
  });
} else {
  console.error('❌ loadAndDisplayHostels is not a function');
}
console.groupEnd();

console.log('%c=== DIAGNOSTIC END - Check results above ===', 'background: #4c6ef5; color: white; padding: 10px; font-weight: bold;');
