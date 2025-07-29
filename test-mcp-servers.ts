#!/usr/bin/env bun

import { spawn } from 'node:child_process';
import { join } from 'node:path';

console.log('🧪 Testing MCP Servers...\n');

async function testMCPServer(packageName: string, serverName: string) {
  console.log(`Testing ${packageName} MCP server...`);
  
  const serverPath = join(__dirname, 'packages', packageName, 'src', 'mcp', 'server.ts');
  const server = spawn('bun', ['run', serverPath], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
      ...process.env,
      ...(packageName === 'courtlistener-sdk' ? { COURTLISTENER_API_TOKEN: 'test-token' } : {})
    }
  });

  let output = '';
  let errorOutput = '';

  server.stdout.on('data', (data) => {
    output += data.toString();
  });

  server.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Send initialize request
  const initRequest = {
    jsonrpc: "2.0",
    method: "initialize",
    params: {
      protocolVersion: "0.1.0",
      capabilities: {},
      clientInfo: {
        name: "test-client",
        version: "1.0.0"
      }
    },
    id: 1
  };

  server.stdin.write(JSON.stringify(initRequest) + '\n');

  // Wait for response
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check outputs
  const combinedOutput = output + errorOutput;
  
  if (combinedOutput.includes('MCP server running on stdio')) {
    console.log(`✅ ${packageName} MCP server started successfully`);
    
    // Try to parse the response
    const lines = output.split('\n');
    for (const line of lines) {
      if (line.trim().startsWith('{')) {
        try {
          const response = JSON.parse(line);
          if (response.result?.serverInfo?.name) {
            console.log(`   Server name: ${response.result.serverInfo.name}`);
            console.log(`   Version: ${response.result.serverInfo.version || 'N/A'}`);
          }
        } catch (e) {
          // Continue checking other lines
        }
      }
    }
  } else {
    console.log(`❌ ${packageName} MCP server failed to start`);
    console.log('   Output:', output);
    console.log('   Error:', errorOutput);
  }

  server.kill();
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log();
}

async function runTests() {
  try {
    await testMCPServer('ecfr-sdk', 'eCFRSDKServer');
    await testMCPServer('federal-register-sdk', 'FederalRegisterServer');
    await testMCPServer('courtlistener-sdk', 'CourtListenerRESTAPIServer');
    await testMCPServer('govinfo-sdk', 'GovInfoServer');
    await testMCPServer('dol-sdk', 'DOLServer');
    
    console.log('🎉 All MCP server tests completed!\n');
  } catch (error) {
    console.error('❌ MCP server test failed:', error.message);
  }
}

runTests();