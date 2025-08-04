#!/usr/bin/env bun

import { spawn } from 'child_process';

const args = process.argv.slice(2);

// Run MCP inspector and capture output
const proc = spawn('bunx', [
  '@modelcontextprotocol/inspector',
  '--cli',
  'bun',
  'src/mcp/server.ts',
  ...args
], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let stdout = '';
let stderr = '';

proc.stdout.on('data', (data) => {
  stdout += data.toString();
});

proc.stderr.on('data', (data) => {
  stderr += data.toString();
});

proc.on('close', (code) => {
  if (code !== 0) {
    console.error('MCP Inspector failed with exit code:', code);
    console.error('stderr:', stderr);
    process.exit(code);
  }
  
  // Find JSON in output
  const jsonMatch = stdout.match(/\{[\s\S]*\}$/m);
  if (jsonMatch) {
    console.log(jsonMatch[0]);
  } else {
    console.error('No JSON found in output');
    console.error('stdout:', stdout);
    process.exit(1);
  }
});