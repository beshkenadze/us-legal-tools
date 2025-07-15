# eCFR SDK

TypeScript SDK and MCP (Model Context Protocol) server for the eCFR (Electronic Code of Federal Regulations) API.

[![CI](https://github.com/yourusername/ecfr-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/ecfr-sdk/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/ecfr-sdk.svg)](https://badge.fury.io/js/ecfr-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **TypeScript SDK** - Fully typed client for all eCFR API endpoints
- 🤖 **MCP Server** - AI-ready server for integration with Claude and other AI assistants
- 🔄 **Auto-generated** - Automatically updated from the official eCFR OpenAPI specification
- 📦 **Modern tooling** - Built with Bun, Biome, and Orval
- 🐳 **Docker support** - Ready-to-use Docker image for the MCP server

## Installation

### SDK Installation

```bash
# npm
npm install ecfr-sdk

# yarn
yarn add ecfr-sdk

# pnpm
pnpm add ecfr-sdk

# bun
bun add ecfr-sdk
```

## Usage

### TypeScript SDK

```typescript
import { ecfrClient } from 'ecfr-sdk';

// Get all agencies
const agencies = await ecfrClient.getApiAdminV1AgenciesJson();

// Search regulations
const searchResults = await ecfrClient.getApiSearchV1Results({
  query: 'environmental protection',
  per_page: 20,
  page: 1,
});

// Get title structure
const titleStructure = await ecfrClient.getApiVersionerV1StructureDateTitleTitleJson({
  date: '2024-01-01',
  title: '40', // Environmental Protection
});
```

### MCP Server

The MCP server allows AI assistants to interact with the eCFR API.

#### Running with Docker

```bash
docker run -i --rm yourusername/ecfr-mcp-server:latest
```

#### Running locally

```bash
# Clone the repository
git clone https://github.com/yourusername/ecfr-sdk.git
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
      "args": ["run", "-i", "--rm", "yourusername/ecfr-mcp-server:latest"],
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
git clone https://github.com/yourusername/ecfr-sdk.git
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
- `bun run mcp:server` - Run MCP server locally
- `bun run docker:build` - Build Docker image
- `bun run docker:run` - Run Docker container

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [eCFR API](https://www.ecfr.gov/developers/documentation) - Official eCFR API
- [Orval](https://orval.dev) - OpenAPI client generator
- [Model Context Protocol](https://modelcontextprotocol.io) - MCP specification
- [Bun](https://bun.sh) - JavaScript runtime & toolkit