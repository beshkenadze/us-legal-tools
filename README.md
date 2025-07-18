# eCFR SDK

TypeScript SDK and MCP (Model Context Protocol) server for the eCFR (Electronic Code of Federal Regulations) API.

[![Release](https://github.com/beshkenadze/ecfr-sdk/actions/workflows/release.yml/badge.svg)](https://github.com/beshkenadze/ecfr-sdk/actions/workflows/release.yml)
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

### From NPM Registry

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

### From GitHub Packages

First, authenticate with GitHub Packages:

```bash
# Create a .npmrc file in your project root
echo "@beshkenadze:registry=https://npm.pkg.github.com" >> .npmrc
echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc
```

Then install:

```bash
npm install @beshkenadze/ecfr-sdk
```

## Usage

### TypeScript SDK

```typescript
import { ecfrClient } from '@beshkenadze/ecfr-sdk';

// Get all agencies
const agencies = await ecfrClient.getApiAdminV1AgenciesJson();
console.log(agencies.agencies);

// Search regulations
const searchResults = await ecfrClient.getApiSearchV1Results({
  query: 'environmental protection',
  per_page: 20,
  page: 1,
});
console.log(`Found ${searchResults.count} results`);

// Get title structure
const titleStructure = await ecfrClient.getApiVersionerV1StructureDateTitleTitleJson({
  date: '2024-01-01',
  title: '40', // Environmental Protection
});

// Get corrections for a specific title
const corrections = await ecfrClient.getApiAdminV1CorrectionsTitleTitleJson({
  title: '40',
});

// Search with filters
const filteredSearch = await ecfrClient.getApiSearchV1Results({
  query: 'carbon emissions',
  title: ['40'], // Only Title 40
  last_modified_on_or_after: '2024-01-01',
  per_page: 50,
});

// Get ancestry information
const ancestry = await ecfrClient.getApiVersionerV1AncestryDateTitleTitleJson({
  date: '2024-01-01',
  title: '40',
  part: '60',
  section: '60.1',
});

// Get search suggestions
const suggestions = await ecfrClient.getApiSearchV1Suggestions({
  query: 'clean air',
  title: ['40', '42'],
});
```

### Error Handling

```typescript
import { ecfrClient } from '@beshkenadze/ecfr-sdk';

try {
  const result = await ecfrClient.getApiSearchV1Results({
    query: 'test',
  });
} catch (error) {
  if (error.response?.status === 404) {
    console.error('Resource not found');
  } else if (error.response?.status === 400) {
    console.error('Bad request:', error.response.data);
  } else {
    console.error('API error:', error.message);
  }
}
```

### Custom Configuration

```typescript
import { createEcfrClient } from '@beshkenadze/ecfr-sdk';

// Create a custom client with your own Axios config
const client = createEcfrClient({
  baseURL: 'https://www.ecfr.gov',
  timeout: 30000,
  headers: {
    'User-Agent': 'MyApp/1.0',
  },
});

const results = await client.getApiSearchV1Results({ query: 'test' });
```

### MCP Server

The MCP server allows AI assistants to interact with the eCFR API.

#### Running with Docker

```bash
docker run -i --rm beshkenadze/ecfr-mcp-server:latest
```

#### Running locally

```bash
# Clone the repository
git clone https://github.com/beshkenadze/ecfr-sdk.git
cd ecfr-sdk

# Install dependencies
bun install

# Run the MCP server
bun run mcp:server
```

#### Configure with Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "ecfr": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "beshkenadze/ecfr-mcp-server:latest"],
      "disabled": false
    }
  }
}
```

Or run locally:

```json
{
  "mcpServers": {
    "ecfr": {
      "command": "bunx",
      "args": ["@beshkenadze/ecfr-sdk", "mcp"],
      "disabled": false
    }
  }
}
```

## API Endpoints

### Admin Service
- `GET /api/admin/v1/agencies.json` - Get all agencies
- `GET /api/admin/v1/corrections.json` - Get eCFR corrections
- `GET /api/admin/v1/corrections/title/{title}.json` - Get corrections by title

### Search Service
- `GET /api/search/v1/results` - Search regulations
- `GET /api/search/v1/count` - Get search result count
- `GET /api/search/v1/summary` - Get search summary
- `GET /api/search/v1/counts/daily` - Get daily counts
- `GET /api/search/v1/counts/titles` - Get counts by title
- `GET /api/search/v1/counts/hierarchy` - Get counts by hierarchy
- `GET /api/search/v1/suggestions` - Get search suggestions

### Versioner Service
- `GET /api/versioner/v1/ancestry/{date}/title-{title}.json` - Get ancestry
- `GET /api/versioner/v1/full/{date}/title-{title}.xml` - Get full XML
- `GET /api/versioner/v1/structure/{date}/title-{title}.json` - Get structure
- `GET /api/versioner/v1/titles.json` - Get all titles
- `GET /api/versioner/v1/versions/title-{title}.json` - Get versions

## Development

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- Node.js >= 18 (for compatibility)
- Docker (optional, for MCP server)

### Setup

```bash
# Clone the repository
git clone https://github.com/beshkenadze/ecfr-sdk.git
cd ecfr-sdk

# Install dependencies
bun install

# Generate SDK from OpenAPI spec
bun run generate

# Run tests
bun test

# Build the package
bun run build
```

### Scripts

- `bun run dev` - Run development server
- `bun run build` - Build the SDK
- `bun run generate` - Regenerate SDK from OpenAPI spec
- `bun run format` - Format code with Biome
- `bun run lint` - Lint code with Biome
- `bun run check` - Run all checks
- `bun run test` - Run tests
- `bun run test:watch` - Run tests in watch mode
- `bun run test:integration` - Run integration tests
- `bun run test:e2e` - Run end-to-end tests
- `bun run mcp:server` - Run MCP server locally
- `bun run docker:build` - Build Docker image
- `bun run docker:run` - Run Docker container

### Project Structure

```
ecfr-sdk/
├── src/
│   ├── api/          # SDK implementation
│   │   ├── client.ts # Axios client configuration
│   │   └── generated/ # Auto-generated API clients
│   ├── mcp/          # MCP server implementation
│   │   └── server.ts # MCP server entry point
│   └── index.ts      # Main SDK exports
├── scripts/          # Build and generation scripts
├── tests/            # Test files
└── docs/             # API documentation
```

## Testing

```bash
# Run all tests
bun test

# Run specific test file
bun test src/api/client.test.ts

# Run tests in watch mode
bun test --watch

# Run integration tests
SKIP_INTEGRATION_TESTS=false bun test src

# Run e2e tests
SKIP_E2E_TESTS=false bun test tests/e2e
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Update documentation as needed
- Follow the existing code style
- Run `bun run check` before committing

## Version Management

This project uses semantic versioning. To release a new version:

```bash
# Patch release (1.0.0 -> 1.0.1)
bun version patch

# Minor release (1.0.0 -> 1.1.0)
bun version minor

# Major release (1.0.0 -> 2.0.0)
bun version major
```

This will automatically:
1. Update the version in package.json
2. Build the project
3. Create a git commit and tag
4. Push to GitHub
5. Trigger the release workflow

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [eCFR API](https://www.ecfr.gov/developers/documentation) - Official eCFR API
- [Orval](https://orval.dev) - OpenAPI client generator
- [Model Context Protocol](https://modelcontextprotocol.io) - MCP specification
- [Bun](https://bun.sh) - JavaScript runtime & toolkit

## Support

- 📚 [API Documentation](https://www.ecfr.gov/developers/documentation)
- 🐛 [Report Issues](https://github.com/beshkenadze/ecfr-sdk/issues)
- 💬 [Discussions](https://github.com/beshkenadze/ecfr-sdk/discussions)