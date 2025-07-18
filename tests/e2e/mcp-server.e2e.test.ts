import { describe, expect, it, beforeAll, afterAll } from 'bun:test';
import { spawn, type ChildProcess } from 'child_process';
import path from 'path';

const SKIP_E2E = process.env.SKIP_E2E_TESTS === 'true';

interface MCPMessage {
  jsonrpc: '2.0';
  id?: number | string;
  method?: string;
  params?: any;
  result?: any;
  error?: any;
}

describe.skipIf(SKIP_E2E)('E2E: MCP Server', () => {
  let serverProcess: ChildProcess;
  let messageId = 1;

  beforeAll(async () => {
    const serverPath = path.join(__dirname, '../../src/mcp/server.ts');
    serverProcess = spawn('bun', ['run', serverPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    // Wait for server to start
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  const sendMessage = (message: MCPMessage): Promise<MCPMessage> => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Response timeout'));
      }, 5000);

      const handleResponse = (data: Buffer) => {
        clearTimeout(timeout);
        serverProcess.stdout!.removeListener('data', handleResponse);
        
        try {
          const response = JSON.parse(data.toString());
          resolve(response);
        } catch (error) {
          reject(error);
        }
      };

      serverProcess.stdout!.once('data', handleResponse);
      serverProcess.stdin!.write(JSON.stringify(message) + '\n');
    });
  };

  describe('Server Lifecycle', () => {
    it('should initialize successfully', async () => {
      const initRequest: MCPMessage = {
        jsonrpc: '2.0',
        id: messageId++,
        method: 'initialize',
        params: {
          protocolVersion: '1.0',
          capabilities: {},
          clientInfo: {
            name: 'e2e-test-client',
            version: '1.0.0',
          },
        },
      };

      const response = await sendMessage(initRequest);

      expect(response.jsonrpc).toBe('2.0');
      expect(response.id).toBe(initRequest.id);
      expect(response.result).toBeDefined();
      expect(response.result.protocolVersion).toBeDefined();
      expect(response.result.serverInfo).toBeDefined();
      expect(response.result.serverInfo.name).toBe('eCFRAPIDocumentationServer');
      expect(response.result.serverInfo.version).toBe('1.0.0');
    });

    it('should list available tools', async () => {
      const listToolsRequest: MCPMessage = {
        jsonrpc: '2.0',
        id: messageId++,
        method: 'tools/list',
        params: {},
      };

      const response = await sendMessage(listToolsRequest);

      expect(response.jsonrpc).toBe('2.0');
      expect(response.id).toBe(listToolsRequest.id);
      expect(response.result).toBeDefined();
      expect(response.result.tools).toBeDefined();
      expect(Array.isArray(response.result.tools)).toBe(true);

      // Check that all expected tools are present
      const toolNames = response.result.tools.map((tool: any) => tool.name);
      const expectedTools = [
        'getApiAdminV1AgenciesJson',
        'getApiAdminV1CorrectionsJson',
        'getApiAdminV1CorrectionsTitleTitleJson',
        'getApiSearchV1Results',
        'getApiSearchV1Count',
        'getApiSearchV1Summary',
        'getApiSearchV1CountsDaily',
        'getApiSearchV1CountsTitles',
        'getApiSearchV1CountsHierarchy',
        'getApiSearchV1Suggestions',
        'getApiVersionerV1AncestryDateTitleTitleJson',
        'getApiVersionerV1FullDateTitleTitleXml',
        'getApiVersionerV1StructureDateTitleTitleJson',
        'getApiVersionerV1TitlesJson',
        'getApiVersionerV1VersionsTitleTitleJson',
      ];

      expectedTools.forEach(toolName => {
        expect(toolNames).toContain(toolName);
      });
    });
  });

  describe('Tool Execution', () => {
    it('should execute getApiAdminV1AgenciesJson tool', async () => {
      const toolRequest: MCPMessage = {
        jsonrpc: '2.0',
        id: messageId++,
        method: 'tools/call',
        params: {
          name: 'getApiAdminV1AgenciesJson',
          arguments: {},
        },
      };

      const response = await sendMessage(toolRequest);

      expect(response.jsonrpc).toBe('2.0');
      expect(response.id).toBe(toolRequest.id);
      expect(response.result).toBeDefined();
      expect(response.result.content).toBeDefined();
      expect(Array.isArray(response.result.content)).toBe(true);
      expect(response.result.content[0].type).toBe('text');

      // Parse the response content
      const data = JSON.parse(response.result.content[0].text);
      expect(data).toHaveProperty('agencies');
      expect(Array.isArray(data.agencies)).toBe(true);
    }, 30000);

    it('should execute search tool with parameters', async () => {
      const toolRequest: MCPMessage = {
        jsonrpc: '2.0',
        id: messageId++,
        method: 'tools/call',
        params: {
          name: 'getApiSearchV1Results',
          arguments: {
            queryParams: {
              q: 'agriculture',
              title: '7',
              page: 1,
              per_page: 5,
            },
          },
        },
      };

      const response = await sendMessage(toolRequest);

      expect(response.jsonrpc).toBe('2.0');
      expect(response.id).toBe(toolRequest.id);
      expect(response.result).toBeDefined();
      expect(response.result.content).toBeDefined();

      // Parse the response content
      const data = JSON.parse(response.result.content[0].text);
      expect(data).toHaveProperty('results');
      expect(data).toHaveProperty('meta');
      expect(Array.isArray(data.results)).toBe(true);
      expect(data.results.length).toBeLessThanOrEqual(5);
    }, 30000);

    it('should execute versioner tool with path parameters', async () => {
      const toolRequest: MCPMessage = {
        jsonrpc: '2.0',
        id: messageId++,
        method: 'tools/call',
        params: {
          name: 'getApiVersionerV1StructureDateTitleTitleJson',
          arguments: {
            pathParams: {
              date: '2023-01-01',
              title: '7',
            },
          },
        },
      };

      const response = await sendMessage(toolRequest);

      expect(response.jsonrpc).toBe('2.0');
      expect(response.id).toBe(toolRequest.id);
      expect(response.result).toBeDefined();
      expect(response.result.content).toBeDefined();

      // Parse the response content
      const data = JSON.parse(response.result.content[0].text);
      expect(data).toHaveProperty('structure');
      expect(data.structure).toHaveProperty('children');
    }, 30000);

    it('should handle tool execution errors gracefully', async () => {
      const toolRequest: MCPMessage = {
        jsonrpc: '2.0',
        id: messageId++,
        method: 'tools/call',
        params: {
          name: 'getApiAdminV1CorrectionsTitleTitleJson',
          arguments: {
            pathParams: {
              title: '999999', // Invalid title
            },
          },
        },
      };

      const response = await sendMessage(toolRequest);

      expect(response.jsonrpc).toBe('2.0');
      expect(response.id).toBe(toolRequest.id);
      
      // Should either return an error or empty results
      if (response.error) {
        expect(response.error).toBeDefined();
      } else {
        expect(response.result).toBeDefined();
      }
    }, 30000);
  });

  describe('Complex Workflows', () => {
    it('should handle sequential tool calls', async () => {
      // First, get all titles
      const titlesRequest: MCPMessage = {
        jsonrpc: '2.0',
        id: messageId++,
        method: 'tools/call',
        params: {
          name: 'getApiVersionerV1TitlesJson',
          arguments: {},
        },
      };

      const titlesResponse = await sendMessage(titlesRequest);
      const titlesData = JSON.parse(titlesResponse.result.content[0].text);
      
      expect(titlesData.titles).toBeDefined();
      expect(titlesData.titles.length).toBeGreaterThan(0);

      // Then, get corrections for the first title
      const firstTitle = titlesData.titles[0].title;
      const correctionsRequest: MCPMessage = {
        jsonrpc: '2.0',
        id: messageId++,
        method: 'tools/call',
        params: {
          name: 'getApiAdminV1CorrectionsTitleTitleJson',
          arguments: {
            pathParams: {
              title: firstTitle,
            },
          },
        },
      };

      const correctionsResponse = await sendMessage(correctionsRequest);
      const correctionsData = JSON.parse(correctionsResponse.result.content[0].text);

      expect(correctionsData.ecfr_corrections).toBeDefined();
      expect(Array.isArray(correctionsData.ecfr_corrections)).toBe(true);
    }, 30000);

    it('should handle multiple parameter types', async () => {
      const toolRequest: MCPMessage = {
        jsonrpc: '2.0',
        id: messageId++,
        method: 'tools/call',
        params: {
          name: 'getApiVersionerV1AncestryDateTitleTitleJson',
          arguments: {
            pathParams: {
              date: '2023-01-01',
              title: '7',
            },
            queryParams: {
              part: '1',
              section: '1.1',
            },
          },
        },
      };

      const response = await sendMessage(toolRequest);

      expect(response.jsonrpc).toBe('2.0');
      expect(response.id).toBe(toolRequest.id);
      expect(response.result).toBeDefined();

      const data = JSON.parse(response.result.content[0].text);
      expect(data).toHaveProperty('ancestry');
      expect(Array.isArray(data.ancestry)).toBe(true);
    }, 30000);
  });

  describe('Error Handling', () => {
    it('should handle invalid method', async () => {
      const invalidRequest: MCPMessage = {
        jsonrpc: '2.0',
        id: messageId++,
        method: 'invalid/method',
        params: {},
      };

      const response = await sendMessage(invalidRequest);

      expect(response.jsonrpc).toBe('2.0');
      expect(response.id).toBe(invalidRequest.id);
      expect(response.error).toBeDefined();
      expect(response.error.code).toBeDefined();
      expect(response.error.message).toBeDefined();
    });

    it('should handle invalid tool name', async () => {
      const toolRequest: MCPMessage = {
        jsonrpc: '2.0',
        id: messageId++,
        method: 'tools/call',
        params: {
          name: 'nonExistentTool',
          arguments: {},
        },
      };

      const response = await sendMessage(toolRequest);

      expect(response.jsonrpc).toBe('2.0');
      expect(response.id).toBe(toolRequest.id);
      expect(response.error).toBeDefined();
    });

    it('should handle missing required parameters', async () => {
      const toolRequest: MCPMessage = {
        jsonrpc: '2.0',
        id: messageId++,
        method: 'tools/call',
        params: {
          name: 'getApiAdminV1CorrectionsTitleTitleJson',
          arguments: {
            // Missing required pathParams
          },
        },
      };

      const response = await sendMessage(toolRequest);

      expect(response.jsonrpc).toBe('2.0');
      expect(response.id).toBe(toolRequest.id);
      expect(response.error).toBeDefined();
    });
  });
});