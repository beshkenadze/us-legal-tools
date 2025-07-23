#!/usr/bin/env bun

import { spawn } from 'node:child_process';

async function testMCPServer() {
  console.log('🧪 Testing MCP server...');
  
  // Start the MCP server
  const server = spawn('bun', ['run', 'mcp:server'], {
    stdio: ['pipe', 'pipe', 'pipe']
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
    console.log('✅ MCP server started successfully');
  }
  
  // Try to parse the response
  const lines = output.split('\n');
  for (const line of lines) {
    if (line.trim().startsWith('{')) {
      try {
        const response = JSON.parse(line);
        if (response.result?.serverInfo?.name === 'eCFRSDKServer') {
          console.log('✅ MCP server responded correctly to initialize request');
          server.kill();
          process.exit(0);
        }
      } catch (e) {
        // Continue checking other lines
      }
    }
  }

  console.error('❌ MCP server test failed');
  console.error('Output:', output);
  console.error('Error:', errorOutput);
  server.kill();
  process.exit(1);
}

testMCPServer().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});