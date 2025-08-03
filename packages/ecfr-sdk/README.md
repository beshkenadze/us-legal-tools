<div align="center">
  <h1>@us-legal-tools/ecfr-sdk</h1>
  <p>
    <strong>TypeScript SDK and MCP server for the Electronic Code of Federal Regulations (eCFR) API</strong>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/@us-legal-tools/ecfr-sdk">
      <img alt="npm version" src="https://img.shields.io/npm/v/@us-legal-tools/ecfr-sdk.svg?style=for-the-badge">
    </a>
    <a href="https://www.npmjs.com/package/@us-legal-tools/ecfr-sdk">
      <img alt="npm downloads" src="https://img.shields.io/npm/dm/@us-legal-tools/ecfr-sdk.svg?style=for-the-badge">
    </a>
    <a href="https://github.com/beshkenadze/us-legal-tools/blob/main/LICENSE">
      <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge">
    </a>
    <a href="https://github.com/beshkenadze/us-legal-tools/actions/workflows/validate.yml">
      <img alt="CI Status" src="https://img.shields.io/github/actions/workflow/status/beshkenadze/us-legal-tools/validate.yml?branch=main&style=for-the-badge">
    </a>
  </p>
  <p>
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#api-reference">API</a> •
    <a href="#mcp-server">MCP Server</a> •
    <a href="https://www.ecfr.gov/api/docs">eCFR API Docs</a>
  </p>
</div>

## Features

- 🚀 **TypeScript SDK** - Fully typed client for all eCFR API endpoints
- 🤖 **MCP Server** - AI-ready server for integration with Claude and other AI assistants
- 🔄 **Auto-generated** - Automatically updated from the official eCFR OpenAPI specification
- 📦 **Modern tooling** - Built with Bun, Biome, and Orval
- 🐳 **Docker support** - Ready-to-use Docker image for the MCP server
- ✨ **Tree-shakeable** - Only import what you need
- 🔍 **Type-safe** - Full TypeScript support with auto-completion
- ⚡ **Fast** - Optimized for performance with minimal dependencies

## Installation

```bash
# npm
npm install @us-legal-tools/ecfr-sdk

# yarn
yarn add @us-legal-tools/ecfr-sdk

# pnpm
pnpm add @us-legal-tools/ecfr-sdk

# bun
bun add @us-legal-tools/ecfr-sdk
```

## Quick Start

### Basic Usage

```typescript
import { getApiSearchV1Results, getApiVersionerV1TitlesJson } from '@us-legal-tools/ecfr-sdk';

// Search for regulations
const searchResults = await getApiSearchV1Results({
  query: 'environmental protection',
  per_page: 10,
  page: 1
});

console.log(`Found ${searchResults.meta.total_count} regulations`);
searchResults.results.forEach(result => {
  console.log(`- Title ${result.hierarchy.title}: ${result.hierarchy_headings.join(' > ')}`);
});

// Get all available titles
const titles = await getApiVersionerV1TitlesJson();
console.log(`Available titles: ${titles.titles.length}`);
```

### Advanced Search

```typescript
import { getApiSearchV1Results } from '@us-legal-tools/ecfr-sdk';

// Search with filters
const results = await getApiSearchV1Results({
  query: 'clean air',
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
import { getApiVersionerV1FullDateTitleTitleXml } from '@us-legal-tools/ecfr-sdk';

// Get a specific version of a regulation
const historicalVersion = await getApiVersionerV1FullDateTitleTitleXml(
  '2023-01-01',  // date
  '40',           // title
  {
    part: '50',
    section: '7'
  }
);

// Note: Large titles (like Title 29) may timeout when fetching the entire XML.
// Consider fetching specific parts or sections instead.
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
npx @us-legal-tools/ecfr-sdk/mcp

# Or if installed locally
cd node_modules/@us-legal-tools/ecfr-sdk
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
      "args": ["@us-legal-tools/ecfr-sdk/mcp"]
    }
  }
}
```

## Error Handling

```typescript
import { getApiSearchV1Results } from '@us-legal-tools/ecfr-sdk';

try {
  const results = await getApiSearchV1Results({
    query: 'search term',
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
import { axiosInstance } from '@us-legal-tools/ecfr-sdk';

// Add request interceptor
axiosInstance.interceptors.request.use(config => {
  console.log('Making request to:', config.url);
  return config;
});

// Modify timeout
axiosInstance.defaults.timeout = 60000; // 60 seconds
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

## Links

- [npm Package](https://www.npmjs.com/package/@us-legal-tools/ecfr-sdk)
- [GitHub Repository](https://github.com/beshkenadze/us-legal-tools)
- [eCFR Website](https://www.ecfr.gov/)
- [eCFR API Documentation](https://www.ecfr.gov/api/docs)
- [Report Issues](https://github.com/beshkenadze/us-legal-tools/issues/new?labels=bug&template=bug-report.md)
- [Request Features](https://github.com/beshkenadze/us-legal-tools/issues/new?labels=enhancement&template=feature-request.md)

## Support

Need help? Check out our [documentation](https://github.com/beshkenadze/us-legal-tools) or [create an issue](https://github.com/beshkenadze/us-legal-tools/issues/new/choose).

<p align="right">(<a href="#readme-top">back to top</a>)</p>