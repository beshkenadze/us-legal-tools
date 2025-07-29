# @us-legal-tools/govinfo-sdk

TypeScript SDK and MCP server for the GovInfo API - providing programmatic access to federal government information from the U.S. Government Publishing Office.

## Installation

```bash
npm install @us-legal-tools/govinfo-sdk
# or
yarn add @us-legal-tools/govinfo-sdk
# or
bun add @us-legal-tools/govinfo-sdk
```

## Features

- 🚀 Full TypeScript support with auto-generated types
- 📦 Lightweight and tree-shakeable
- 🔧 Built on top of Axios for reliable HTTP requests
- 🤖 MCP (Model Context Protocol) server included
- ⚡ Support for all GovInfo API endpoints
- 🛡️ Type-safe request and response handling

## Quick Start

```typescript
import { createGovInfoClient } from '@us-legal-tools/govinfo-sdk';

// Initialize the client
const client = createGovInfoClient({
  apiKey: 'YOUR_API_KEY', // Get from https://api.data.gov/signup/
});

// Example: Search for documents
const searchResults = await client.search({
  query: 'climate change',
  pageSize: 10,
});
```

## API Client Usage

### Configuration

```typescript
import { createGovInfoClient } from '@us-legal-tools/govinfo-sdk';

const client = createGovInfoClient({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://api.govinfo.gov', // Optional, this is the default
  timeout: 30000, // Optional timeout in ms
});
```

### Available Methods

The SDK provides methods for all GovInfo API endpoints. Methods will be auto-generated based on the OpenAPI specification.

## MCP Server

The package includes an MCP server that can be used with Claude Desktop or other MCP-compatible applications.

### Configuration

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "govinfo": {
      "command": "npx",
      "args": ["@us-legal-tools/govinfo-sdk/mcp"],
      "env": {
        "GOVINFO_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

### Available Tools

The MCP server exposes GovInfo API operations as tools that can be called by Claude or other MCP clients. Each API endpoint becomes a callable tool with appropriate parameters.

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/beshkenadze/ecfr-sdk.git
cd ecfr-sdk/packages/govinfo-sdk

# Install dependencies
bun install

# Generate SDK from OpenAPI spec
bun run generate

# Build the package
bun run build

# Run tests
bun test
```

### Testing

The test suite requires a GovInfo API key. You can obtain one for free at https://api.data.gov/signup/.

```bash
# Set your API key in the environment
export GOV_INFO_API_KEY=your_api_key_here

# Or create a .env file in the project root
echo "GOV_INFO_API_KEY=your_api_key_here" >> ../../.env

# Run all tests
bun test

# Run e2e tests specifically
bun run test:e2e
```

### Scripts

- `bun run generate` - Download OpenAPI spec and generate SDK code
- `bun run build` - Build the package for distribution
- `bun run test` - Run unit tests
- `bun run test:integration` - Run integration tests
- `bun run mcp:server` - Run the MCP server locally

## API Documentation

For detailed API documentation, visit:
- [GovInfo API Documentation](https://api.govinfo.gov/docs/)
- [GovInfo Developer Resources](https://www.govinfo.gov/developers)

## Links

- [npm Package](https://www.npmjs.com/package/@us-legal-tools/govinfo-sdk)
- [GovInfo API Documentation](https://api.govinfo.gov/docs/)
- [GovInfo Developer Resources](https://www.govinfo.gov/developers)