# @beshkenadze/ecfr-sdk

TypeScript SDK and MCP (Model Context Protocol) server for the eCFR (Electronic Code of Federal Regulations) API.

[![npm version](https://badge.fury.io/js/@beshkenadze%2Fecfr-sdk.svg)](https://badge.fury.io/js/@beshkenadze%2Fecfr-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **TypeScript SDK** - Fully typed client for all eCFR API endpoints
- 🤖 **MCP Server** - AI-ready server for integration with Claude and other AI assistants
- 🔄 **Auto-generated** - Automatically updated from the official eCFR OpenAPI specification
- 📦 **Modern tooling** - Built with Bun, Biome, and Orval
- 🐳 **Docker support** - Ready-to-use Docker image for the MCP server
- ✨ **Tree-shakeable** - Only import what you need
- 🔍 **Type-safe** - Full TypeScript support with auto-completion

## Installation

```bash
# npm
npm install @beshkenadze/ecfr-sdk

# yarn
yarn add @beshkenadze/ecfr-sdk

# pnpm
pnpm add @beshkenadze/ecfr-sdk

# bun
bun add @beshkenadze/ecfr-sdk
```

## Quick Start

### Basic Usage

```typescript
import { getApiSearchV1Results, getApiVersionerV1TitlesJson } from '@beshkenadze/ecfr-sdk';

// Search for regulations
const searchResults = await getApiSearchV1Results({
  q: 'environmental protection',
  per_page: 10,
  page: 1
});

console.log(`Found ${searchResults.count} regulations`);
searchResults.results.forEach(result => {
  console.log(`- ${result.title}: ${result.label_string}`);
});

// Get all available titles
const titles = await getApiVersionerV1TitlesJson();
console.log(`Available titles: ${titles.titles.length}`);
```

### Advanced Search

```typescript
import { getApiSearchV1Results } from '@beshkenadze/ecfr-sdk';

// Search with filters
const results = await getApiSearchV1Results({
  q: 'clean air',
  title: 40, // Title 40: Protection of Environment
  part: 50,  // Part 50
  date: '2024-01-01',
  condition: 'AND',
  per_page: 20
});

// Access faceted search metadata
console.log('Search facets:', results.meta?.facets);
```

### Historical Versions

```typescript
import { getApiVersionerV1FullDateTitleTitleXml } from '@beshkenadze/ecfr-sdk';

// Get a specific version of a regulation
const historicalVersion = await getApiVersionerV1FullDateTitleTitleXml({
  date: '2023-01-01',
  title: '40',
  part: '50',
  section: '7'
});
```

## API Reference

### Search Endpoints

- `getApiSearchV1Results` - Search all regulations
- `getApiSearchV1Count` - Get search result count
- `getApiSearchV1Summary` - Get search summary
- `getApiSearchV1CountsDaily` - Get daily search counts
- `getApiSearchV1CountsTitles` - Get search counts by title
- `getApiSearchV1CountsHierarchy` - Get hierarchical search counts
- `getApiSearchV1Suggestions` - Get search suggestions

### Versioning Endpoints

- `getApiVersionerV1TitlesJson` - Get all available titles
- `getApiVersionerV1FullDateTitleTitleXml` - Get full regulation text
- `getApiVersionerV1StructureDateTitleTitleJson` - Get regulation structure
- `getApiVersionerV1VersionsTitleTitleJson` - Get available versions
- `getApiVersionerV1AncestryDateTitleTitleJson` - Get regulation ancestry

### Admin Endpoints

- `getApiAdminV1AgenciesJson` - Get all agencies
- `getApiAdminV1CorrectionsJson` - Get all corrections
- `getApiAdminV1CorrectionsTitleTitleJson` - Get corrections for a title

## MCP Server

The MCP server allows AI assistants to interact with the eCFR API.

### Running the Server

```bash
# Using the SDK directly
npx @beshkenadze/ecfr-sdk/mcp

# Or if installed locally
cd node_modules/@beshkenadze/ecfr-sdk
npm run mcp:server
```

### Docker Support

```bash
# Pull and run the Docker image
docker run -i ghcr.io/beshkenadze/ecfr-mcp-server:latest
```

### Integration with Claude

Add to your Claude configuration:

```json
{
  "mcpServers": {
    "ecfr": {
      "command": "npx",
      "args": ["@beshkenadze/ecfr-sdk/mcp"]
    }
  }
}
```

## Error Handling

```typescript
import { getApiSearchV1Results } from '@beshkenadze/ecfr-sdk';

try {
  const results = await getApiSearchV1Results({
    q: 'search term',
    per_page: 10
  });
} catch (error) {
  if (error.response?.status === 400) {
    console.error('Invalid search parameters');
  } else if (error.response?.status === 429) {
    console.error('Rate limit exceeded');
  } else {
    console.error('API error:', error.message);
  }
}
```

## Configuration

The SDK uses axios under the hood. You can access and modify the axios instance:

```typescript
import { axiosInstance } from '@beshkenadze/ecfr-sdk';

// Add request interceptor
axiosInstance.interceptors.request.use(config => {
  console.log('Making request to:', config.url);
  return config;
});

// Modify timeout
axiosInstance.defaults.timeout = 60000; // 60 seconds
```

## License

MIT License - see [LICENSE](../../LICENSE) for details

## Links

- [GitHub Repository](https://github.com/beshkenadze/ecfr-sdk)
- [npm Package](https://www.npmjs.com/package/@beshkenadze/ecfr-sdk)
- [eCFR Website](https://www.ecfr.gov/)
- [eCFR API Documentation](https://www.ecfr.gov/api/docs)