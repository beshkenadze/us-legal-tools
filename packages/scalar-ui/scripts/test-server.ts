#!/usr/bin/env bun

/**
 * Script to test the Scalar UI server
 * Checks that all API documentation endpoints are accessible
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const endpoints = [
  { path: '/', name: 'Home Page' },
  { path: '/health', name: 'Health Check' },
  { path: '/ecfr', name: 'eCFR API Docs' },
  { path: '/dol', name: 'DOL API Docs' },
  { path: '/federal-register', name: 'Federal Register API Docs' },
  { path: '/govinfo', name: 'GovInfo API Docs' },
  { path: '/courtlistener', name: 'CourtListener API Docs' },
];

async function testEndpoint(path: string, name: string) {
  try {
    const response = await fetch(`${BASE_URL}${path}`);
    const status = response.status;
    const ok = response.ok;
    
    console.log(`${ok ? '✅' : '❌'} ${name} (${path}): ${status}`);
    
    if (path === '/health') {
      const data = await response.json();
      console.log(`   Response: ${JSON.stringify(data)}`);
    }
    
    return ok;
  } catch (error) {
    console.log(`❌ ${name} (${path}): ${error}`);
    return false;
  }
}

async function main() {
  console.log(`🧪 Testing Scalar UI server at ${BASE_URL}\n`);
  
  const results = await Promise.all(
    endpoints.map(({ path, name }) => testEndpoint(path, name))
  );
  
  const passed = results.filter(Boolean).length;
  const total = results.length;
  
  console.log(`\n📊 Results: ${passed}/${total} tests passed`);
  
  if (passed < total) {
    console.log('\n⚠️  Some tests failed. Make sure:');
    console.log('   1. The server is running (bun run dev)');
    console.log('   2. All OpenAPI spec files exist');
    console.log('   3. The spec file paths are correct');
    process.exit(1);
  } else {
    console.log('\n✨ All tests passed!');
  }
}

main().catch(console.error);