// PRODUCTION QA: API Connectivity Diagnostic
// Run this in browser console on https://mwgbysama.vercel.app/ to diagnose

(async () => {
  console.log('========== DIAGNOSTIC START ==========');
  console.log(`📍 Current Hostname: ${window.location.hostname}`);
  console.log(`📍 Protocol: ${window.location.protocol}`);
  
  // Test 1: Check if HostelAPI is defined
  console.log('\n[TEST 1] HostelAPI Definition');
  if (typeof HostelAPI === 'undefined') {
    console.error('❌ HostelAPI is NOT defined!');
    console.log('   This means hostel-api.js failed to load or execute');
  } else {
    console.log('✅ HostelAPI is defined');
    console.log(`   API_BASE_URL: ${typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'NOT DEFINED'}`);
  }
  
  // Test 2: Check if appOptimizer is defined
  console.log('\n[TEST 2] appOptimizer Definition');
  if (typeof window.appOptimizer === 'undefined') {
    console.warn('⚠️ appOptimizer is NOT defined - caching will fail');
  } else {
    console.log('✅ appOptimizer is defined');
  }
  
  // Test 3: Try to fetch hostels from production API directly
  console.log('\n[TEST 3] Direct API Call');
  try {
    const response = await fetch('https://sama-production-9e28.up.railway.app/api/hostels', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    });
    
    console.log(`Response Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ API Call Success - Received ${data.count || 0} hostels`);
      console.log('Sample data:', data.data ? data.data[0] : 'No data');
    } else {
      console.error(`❌ API returned error: ${response.status}`);
      const text = await response.text();
      console.error('Response body:', text);
    }
  } catch (error) {
    console.error('❌ API Call Failed:', error.message);
    console.error('Error type:', error.constructor.name);
  }
  
  // Test 4: Try HostelAPI.getAllHostels() if it exists
  console.log('\n[TEST 4] HostelAPI.getAllHostels() Call');
  if (typeof HostelAPI !== 'undefined' && typeof HostelAPI.getAllHostels === 'function') {
    try {
      const hostels = await HostelAPI.getAllHostels();
      console.log(`✅ HostelAPI.getAllHostels() Success - Received ${hostels ? hostels.length : 0} hostels`);
      if (hostels && hostels.length > 0) {
        console.log('First hostel:', hostels[0]);
      }
    } catch (error) {
      console.error('❌ HostelAPI.getAllHostels() Failed:', error.message);
      console.error('Full error:', error);
    }
  } else {
    console.error('❌ HostelAPI.getAllHostels is not callable');
  }
  
  // Test 5: Check network conditions
  console.log('\n[TEST 5] Network Information');
  if (navigator.onLine) {
    console.log('✅ Navigator says: ONLINE');
  } else {
    console.error('❌ Navigator says: OFFLINE');
  }
  
  if ('connection' in navigator) {
    const connection = navigator.connection;
    console.log(`Connection type: ${connection.effectiveType}`);
    console.log(`Downlink speed: ${connection.downlink} Mbps`);
    console.log(`RTT: ${connection.rtt} ms`);
  }
  
  console.log('\n========== DIAGNOSTIC END ==========');
})();
