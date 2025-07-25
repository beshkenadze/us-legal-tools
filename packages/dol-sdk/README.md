# Department of Labor SDK

TypeScript SDK for the Department of Labor API with MCP (Model Context Protocol) support.

## Installation

```bash
npm install @beshkenadze/dol-sdk
# or
yarn add @beshkenadze/dol-sdk
# or
bun add @beshkenadze/dol-sdk
```

## Usage

### Basic Usage

```typescript
import { getAgencies, getDatasets, getStatistics } from '@beshkenadze/dol-sdk';

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
import { apiClient } from '@beshkenadze/dol-sdk';

apiClient.defaults.headers['X-API-Key'] = 'your-api-key-here';
```

## MCP Server

This package includes an MCP server for use with Claude Desktop or other MCP clients.

### Running the MCP Server

```bash
# Using npx
npx @beshkenadze/dol-sdk

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

## License

MIT