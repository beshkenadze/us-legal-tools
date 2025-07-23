#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import * as handlers from './handlers';

const server = new Server(
  {
    name: 'dol-mcp-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions based on generated operations
const tools = [
  {
    name: 'getDatasets',
    description: 'List Available Datasets - Retrieve the complete catalog of datasets available through the DOL API in JSON format. This endpoint does not require an API key.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'getGetAgencyEndpointFormat',
    description: 'Retrieve Dataset Data - Retrieve data from a specific dataset with optional filtering, sorting, and field selection.',
    inputSchema: {
      type: 'object',
      properties: {
        pathParams: {
          type: 'object',
          properties: {
            agency: {
              type: 'string',
              description: 'Agency name abbreviation (e.g., "msha", "osha", "ebsa")',
            },
            endpoint: {
              type: 'string',
              description: 'Dataset endpoint/identifier from the datasets catalog',
            },
            format: {
              type: 'string',
              enum: ['json', 'xml', 'csv'],
              description: 'Response format for the data',
            },
          },
          required: ['agency', 'endpoint', 'format'],
        },
        queryParams: {
          type: 'object',
          properties: {
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 10000,
              description: 'Maximum number of records to return (max 10,000 records or 5MB)',
            },
            offset: {
              type: 'integer',
              minimum: 0,
              description: 'Number of records to skip from the top of the dataset',
            },
            fields: {
              type: 'string',
              description: 'Comma-separated list of specific field names to include in response',
            },
            sort: {
              type: 'string',
              enum: ['asc', 'desc'],
              description: 'Sort direction for the returned records',
            },
            sort_by: {
              type: 'string',
              description: 'Field name to sort records by',
            },
            filter_object: {
              type: 'string',
              description: 'JSON formatted string specifying conditional filters to apply',
            },
          },
        },
      },
      required: ['pathParams'],
    },
  },
  {
    name: 'getGetAgencyEndpointFormatMetadata',
    description: 'Retrieve Dataset Metadata - Retrieve comprehensive metadata about a dataset including field descriptions, data types, and other characteristics that help understand the dataset structure.',
    inputSchema: {
      type: 'object',
      properties: {
        pathParams: {
          type: 'object',
          properties: {
            agency: {
              type: 'string',
              description: 'Agency name abbreviation (e.g., "msha", "osha", "ebsa")',
            },
            endpoint: {
              type: 'string',
              description: 'Dataset endpoint/identifier from the datasets catalog',
            },
            format: {
              type: 'string',
              enum: ['json', 'xml', 'csv'],
              description: 'Response format for the data',
            },
          },
          required: ['agency', 'endpoint', 'format'],
        },
      },
      required: ['pathParams'],
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const handlerName = `${name}Handler`;
    const handler = handlers[handlerName as keyof typeof handlers];
    
    if (!handler) {
      throw new Error(`Unknown tool: ${name}`);
    }

    const result = await handler(args as any);
    return result;
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error',
          }),
        },
      ],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('DOL MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});