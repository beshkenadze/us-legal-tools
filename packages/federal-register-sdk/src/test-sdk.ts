#!/usr/bin/env bun

import { 
  getAgencies, 
  getDocumentsFormat, 
  getPublicInspectionDocumentsCurrentFormat 
} from './api/generated/endpoints';
import { customInstance } from './api/client';

console.log('🧪 Testing Federal Register SDK...\n');

async function testFederalRegisterSDK() {
  // Configure the base URL for the custom instance
  customInstance.defaults.baseURL = 'https://www.federalregister.gov/api/v1';
  
  try {
    // Test 1: Get agencies
    console.log('1️⃣ Testing getAgencies...');
    const agencies = await getAgencies();
    console.log(`✅ Found ${agencies.data.length} agencies`);
    if (agencies.data.length > 0) {
      console.log(`   Sample: ${agencies.data[0].name} (ID: ${agencies.data[0].id})\n`);
    }

    // Test 2: Search documents
    console.log('2️⃣ Testing getDocumentsFormat...');
    const documents = await getDocumentsFormat(
      'json',
      {
        per_page: 5
      }
    );
    console.log(`✅ Found ${documents.data.count} total documents`);
    console.log(`   Showing first ${documents.data.results.length} documents:`);
    documents.data.results.forEach((doc, i) => {
      console.log(`   ${i + 1}. ${doc.title || 'Untitled'}`);
      console.log(`      Type: ${doc.type}, Date: ${doc.publication_date}`);
    });
    console.log();

    // Test 3: Get current public inspection documents
    console.log('3️⃣ Testing getPublicInspectionDocumentsCurrentFormat...');
    const piDocs = await getPublicInspectionDocumentsCurrentFormat('json');
    console.log(`✅ Found ${piDocs.data.count} documents on public inspection`);
    if (piDocs.data.results.length > 0) {
      console.log(`   Latest: ${piDocs.data.results[0].title || 'Untitled'}`);
    }
    console.log();

    console.log('🎉 All Federal Register SDK tests passed!\n');
    return true;
  } catch (error) {
    console.error('❌ Federal Register SDK test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

// Run the tests
testFederalRegisterSDK().then(success => {
  process.exit(success ? 0 : 1);
});