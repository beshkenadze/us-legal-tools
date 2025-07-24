#!/usr/bin/env bun

/**
 * Script to test the Scalar UI server
 * Checks that all API documentation endpoints are accessible
 */

import { spawn } from 'child_process';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const SERVER_START_TIMEOUT = 5000; // 5 seconds

const endpoints = [
  { path: '/', name: 'Home Page' },
  { path: '/health', name: 'Health Check' },
  { path: '/ecfr', name: 'eCFR API Docs' },
  { path: '/dol', name: 'DOL API Docs' },
  { path: '/federal-register', name: 'Federal Register API Docs' },
  { path: '/govinfo', name: 'GovInfo API Docs' },
  { path: '/courtlistener', name: 'CourtListener API Docs' },
];

async function waitForServer(url: string, timeout: number): Promise<boolean> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(`${url}/health`);
      if (response.ok) return true;
    } catch (error) {
      // Server not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return false;
}

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
  
  // Start the server
  console.log('🚀 Starting server...');
  const serverProcess = spawn('bun', ['run', 'src/server.ts'], {
    stdio: 'pipe',
    env: { ...process.env, PORT: '3000' }
  });
  
  // Handle server output
  serverProcess.stdout.on('data', (data) => {
    console.log(`   Server: ${data.toString().trim()}`);
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.error(`   Server Error: ${data.toString().trim()}`);
  });
  
  try {
    // Wait for server to start
    const serverReady = await waitForServer(BASE_URL, SERVER_START_TIMEOUT);
    
    if (!serverReady) {
      console.error('❌ Server failed to start within timeout');
      process.exit(1);
    }
    
    console.log('✅ Server started successfully\n');
    
    // Run tests
    const results = await Promise.all(
      endpoints.map(({ path, name }) => testEndpoint(path, name))
    );
    
    const passed = results.filter(Boolean).length;
    const total = results.length;
    
    console.log(`\n📊 Results: ${passed}/${total} tests passed`);
    
    if (passed < total) {
      console.log('\n⚠️  Some tests failed. Make sure:');
      console.log('   1. All OpenAPI spec files exist');
      console.log('   2. The spec file paths are correct');
      process.exit(1);
    } else {
      console.log('\n✨ All tests passed!');
    }
  } finally {
    // Clean up: kill the server
    console.log('\n🛑 Stopping server...');
    serverProcess.kill();
  }
}

main().catch(console.error);