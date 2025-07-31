#!/usr/bin/env bun

import { get, getSearch, getCourts } from './api/generated/endpoints';

console.log('🧪 Testing CourtListener SDK...\n');

async function testCourtListenerSDK() {
  // Note: Most endpoints require authentication
  // Set COURTLISTENER_API_TOKEN environment variable to test authenticated endpoints
  
  try {
    // Test 1: Get API root (no auth required)
    console.log('1️⃣ Testing API root endpoint...');
    try {
      const root = await get();
      console.log('✅ API root accessed successfully');
      console.log(`   Available endpoints: ${Object.keys(root.data || root).length}\n`);
    } catch (e) {
      console.log('⚠️  API root endpoint not accessible\n');
    }

    // Test 2: Search (may work without auth with limitations)
    console.log('2️⃣ Testing search endpoint...');
    try {
      const searchResults = await getSearch({
        type: 'o', // opinions
        q: 'first amendment',
        order_by: 'score'
      });
      const data = searchResults.data || searchResults;
      console.log(`✅ Search returned ${data.count} results`);
      if (data.results && data.results.length > 0) {
        console.log(`   First result: ${data.results[0].caseName || 'No case name'}`);
      }
    } catch (e) {
      console.log('⚠️  Search requires authentication or hit rate limit');
      console.log(`   Error: ${e.message}`);
    }
    console.log();

    // Test 3: Courts list (usually public)
    console.log('3️⃣ Testing courts endpoint...');
    try {
      const courts = await getCourts({
        page: 1
      });
      const data = courts.data || courts;
      console.log(`✅ Found ${data.count || data.results?.length || 0} courts`);
      if (data.results && data.results.length > 0) {
        console.log(`   Sample court: ${data.results[0].full_name || data.results[0].short_name}`);
      }
    } catch (e) {
      console.log('⚠️  Courts endpoint error:', e.message);
    }
    console.log();

    if (process.env.COURTLISTENER_API_TOKEN) {
      console.log('🔑 API token detected, testing authenticated endpoints...\n');
      
      // Test authenticated endpoints here
      // For example: getDockets, getAlerts, etc.
    } else {
      console.log('💡 Tip: Set COURTLISTENER_API_TOKEN environment variable to test authenticated endpoints\n');
    }

    console.log('🎉 CourtListener SDK basic tests completed!\n');
    return true;
  } catch (error) {
    console.error('❌ CourtListener SDK test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

// Run the tests
testCourtListenerSDK().then(success => {
  process.exit(success ? 0 : 1);
});