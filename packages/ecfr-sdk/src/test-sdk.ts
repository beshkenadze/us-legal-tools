#!/usr/bin/env bun

import { getEcfrsdk } from './api/generated/endpoints';

console.log('🧪 Testing eCFR SDK...\n');

async function testEcfrSDK() {
  const sdk = getEcfrsdk();
  
  try {
    // Test 1: Get all titles
    console.log('1️⃣ Testing getApiVersionerV1TitlesJson...');
    const titles = await sdk.getApiVersionerV1TitlesJson();
    console.log('Response:', JSON.stringify(titles, null, 2).slice(0, 200));
    const titleData = titles.data || titles;
    console.log(`✅ Found ${titleData.titles.length} titles`);
    console.log(`   Sample: Title ${titleData.titles[0].number} - ${titleData.titles[0].name}\n`);

    // Test 2: Search regulations
    console.log('2️⃣ Testing getApiSearchV1Results...');
    const searchResults = await sdk.getApiSearchV1Results({
      query: 'environmental protection',
      per_page: 5,
      page: 1
    });
    const searchData = searchResults.data || searchResults;
    console.log(`✅ Search returned ${searchData.count} total results`);
    console.log(`   Showing first ${searchData.results.length} results:`);
    searchData.results.forEach((result, i) => {
      console.log(`   ${i + 1}. ${result.title}: ${result.label_string}`);
    });
    console.log();

    // Test 3: Get agencies
    console.log('3️⃣ Testing getApiAdminV1AgenciesJson...');
    const agencies = await sdk.getApiAdminV1AgenciesJson();
    const agencyData = agencies.data || agencies;
    console.log(`✅ Found ${Object.keys(agencyData).length} agencies`);
    const firstAgency = Object.values(agencyData)[0];
    console.log(`   Sample: ${firstAgency.name} (${firstAgency.slug})\n`);

    // Test 4: Get search suggestions
    console.log('4️⃣ Testing getApiSearchV1Suggestions...');
    const suggestions = await sdk.getApiSearchV1Suggestions({
      query: 'clean air'
    });
    const suggestionData = suggestions.data || suggestions;
    console.log(`✅ Got ${suggestionData.suggestions.length} suggestions`);
    if (suggestionData.suggestions.length > 0) {
      console.log(`   Suggestions: ${suggestionData.suggestions.slice(0, 3).join(', ')}...`);
    }
    console.log();

    console.log('🎉 All eCFR SDK tests passed!\n');
    return true;
  } catch (error) {
    console.error('❌ eCFR SDK test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    return false;
  }
}

// Run the tests
testEcfrSDK().then(success => {
  process.exit(success ? 0 : 1);
});