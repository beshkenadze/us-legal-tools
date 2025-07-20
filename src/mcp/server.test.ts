import { describe, expect, it } from 'bun:test';
import { spawn } from 'child_process';
import path from 'path';

describe('MCP Server', () => {
  it('should start without errors', async () => {
    const serverPath = path.join(__dirname, 'server.ts');

    // Start the server
    const serverProcess = spawn('bun', ['run', serverPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    // Collect stderr output
    let stderrData = '';
    serverProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    // Wait for server to start
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if server started successfully
    expect(stderrData).toContain('MCP server running on stdio');

    // Kill the server
    serverProcess.kill();

    // Wait for cleanup
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  it('should handle initialize request', async () => {
    const serverPath = path.join(__dirname, 'server.ts');

    // Start the server
    const serverProcess = spawn('bun', ['run', serverPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    // Send initialize request
    const initRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '1.0',
        capabilities: {},
        clientInfo: {
          name: 'test-client',
          version: '1.0.0',
        },
      },
    };

    serverProcess.stdin.write(JSON.stringify(initRequest) + '\n');

    // Wait for response
    const response = await new Promise<string>((resolve) => {
      serverProcess.stdout.once('data', (data) => {
        resolve(data.toString());
      });
    });

    // Parse and verify response
    const parsed = JSON.parse(response);
    expect(parsed.jsonrpc).toBe('2.0');
    expect(parsed.id).toBe(1);
    expect(parsed.result).toBeDefined();
    expect(parsed.result.protocolVersion).toBeDefined();
    expect(parsed.result.protocolVersion).toMatch(/^\d{4}-\d{2}-\d{2}$/); // Expect date format
    expect(parsed.result.serverInfo.name).toBe('eCFRSDKServer');

    // Kill the server
    serverProcess.kill();

    // Wait for cleanup
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
});
