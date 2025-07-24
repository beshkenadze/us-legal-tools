import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { spawn, type Subprocess } from 'bun';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

describe('GovInfo MCP Server E2E Tests', () => {
  let mcpProcess: Subprocess;
  let mcpClient: Client;
  let transport: StdioClientTransport;

  beforeAll(async () => {
    // Start the MCP server
    mcpProcess = spawn(['bun', 'run', 'src/mcp/server.ts'], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        GOV_INFO_API_KEY: process.env.GOV_INFO_API_KEY,
      },
      stdin: 'pipe',
      stdout: 'pipe',
      stderr: 'pipe',
    });

    // Create MCP client
    transport = new StdioClientTransport({
      command: 'bun',
      args: ['run', 'src/mcp/server.ts'],
      env: {
        GOV_INFO_API_KEY: process.env.GOV_INFO_API_KEY,
      },
    });

    mcpClient = new Client({
      name: 'test-client',
      version: '1.0.0',
    }, {
      capabilities: {},
    });

    await mcpClient.connect(transport);
  });

  afterAll(async () => {
    // Clean up
    if (mcpClient) {
      await mcpClient.close();
    }
    if (mcpProcess) {
      mcpProcess.kill();
    }
  });

  test('should list available tools', async () => {
    const tools = await mcpClient.listTools();
    
    expect(tools).toBeDefined();
    expect(tools.tools).toBeDefined();
    expect(Array.isArray(tools.tools)).toBe(true);
    expect(tools.tools.length).toBeGreaterThan(0);

    // Check for expected tools
    const toolNames = tools.tools.map(t => t.name);
    expect(toolNames).toContain('search');
    expect(toolNames).toContain('getCollectionSummary');
    expect(toolNames).toContain('packageDetails');
  });

  test('should execute search tool', async () => {
    const result = await mcpClient.callTool({
      name: 'search',
      arguments: {
        bodyParams: {
          query: 'federal register',
          pageSize: 3,
        },
      },
    });

    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.content[0].type).toBe('text');
  }, 30000);

  test('should execute getCollectionSummary tool', async () => {
    const result = await mcpClient.callTool({
      name: 'getCollectionSummary',
      arguments: {},
    });

    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.content[0].type).toBe('text');
  }, 30000);
});