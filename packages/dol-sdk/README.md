# @us-legal-tools/dol-sdk

TypeScript SDK and MCP server for the Department of Labor API.

[![npm version](https://img.shields.io/npm/v/@us-legal-tools/dol-sdk.svg)](https://www.npmjs.com/package/@us-legal-tools/dol-sdk)

## Installation

```bash
npm install @us-legal-tools/dol-sdk
# or
yarn add @us-legal-tools/dol-sdk
# or
bun add @us-legal-tools/dol-sdk
```

## Usage

### Basic Usage

```typescript
import { getAgencies, getDatasets, getStatistics } from '@us-legal-tools/dol-sdk';

// Get all DOL agencies
const agencies = await getAgencies();

// Get datasets filtered by agency
const datasets = await getDatasets({
  agency: 'BLS',
  format: 'json'
});

// Get employment statistics
const stats = await getStatistics('employment', {
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});
```

### With API Key

Set your DOL API key as an environment variable:

```bash
export DOL_API_KEY=your-api-key-here
```

Or configure it programmatically:

```typescript
import { apiClient } from '@us-legal-tools/dol-sdk';

apiClient.defaults.headers['X-API-Key'] = 'your-api-key-here';
```

## MCP Server

This package includes an MCP server for use with Claude Desktop or other MCP clients.

### Running the MCP Server

```bash
# Using npx
npx @us-legal-tools/dol-sdk

# Or directly
dol-mcp-server
```

### Available Tools

- `getAgencies` - List all DOL agencies
- `getDatasets` - List available datasets with optional filters
- `getStatistics` - Get labor statistics by category

## Development

This SDK is generated from the DOL OpenAPI specification using Orval. To regenerate the SDK:

```bash
bun run generate
```

## Links

- [npm Package](https://www.npmjs.com/package/@us-legal-tools/dol-sdk)
- [DOL Developer Portal](https://developer.dol.gov/)
- [DOL API Documentation](https://developer.dol.gov/beginners-guide/)