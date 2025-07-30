<div align="center">
  <h1>🏛️ Federal Legal APIs Monorepo</h1>
  <p>
    <strong>TypeScript SDKs and MCP servers for U.S. federal legal and regulatory APIs</strong>
  </p>
  <p>
    <a href="https://github.com/beshkenadze/us-legal-tools/actions/workflows/validate.yml">
      <img alt="CI Status" src="https://github.com/beshkenadze/us-legal-tools/actions/workflows/validate.yml/badge.svg">
    </a>
    <a href="https://github.com/beshkenadze/us-legal-tools/actions/workflows/release.yml">
      <img alt="Release Status" src="https://github.com/beshkenadze/us-legal-tools/actions/workflows/release.yml/badge.svg">
    </a>
    <a href="https://opensource.org/licenses/MIT">
      <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg">
    </a>
    <a href="https://github.com/beshkenadze/us-legal-tools">
      <img alt="GitHub Stars" src="https://img.shields.io/github/stars/beshkenadze/us-legal-tools?style=social">
    </a>
  </p>
</div>

<hr>

## 📑 Table of Contents

- [Quick Start](#-quick-start)
- [Packages](#-packages)
- [Key Features](#-key-features)
- [Usage Examples](#-usage-examples)
- [MCP Servers](#-mcp-model-context-protocol-servers)
- [Authentication](#-authentication)
- [Development](#️-development)
- [Contributing](#-contributing)
- [Resources](#-resources)

## 🚀 Quick Start

```bash
# Install any SDK
npm install @us-legal-tools/ecfr-sdk
npm install @us-legal-tools/federal-register-sdk
npm install @us-legal-tools/courtlistener-sdk
npm install @us-legal-tools/govinfo-sdk
npm install @us-legal-tools/dol-sdk

# Or clone and run locally
git clone https://github.com/beshkenadze/us-legal-tools.git
cd ecfr-sdk
bun install
turbo build
```

## 📦 Packages

<table>
<tr>
<th align="center">Package</th>
<th align="center">Version</th>
<th align="center">Description</th>
</tr>
<tr>
<td><a href="./packages/ecfr-sdk"><b>@us-legal-tools/ecfr-sdk</b></a></td>
<td align="center"><a href="https://www.npmjs.com/package/@us-legal-tools/ecfr-sdk"><img src="https://img.shields.io/npm/v/@us-legal-tools/ecfr-sdk.svg" alt="npm version"></a></td>
<td>Electronic Code of Federal Regulations API</td>
</tr>
<tr>
<td><a href="./packages/federal-register-sdk"><b>@us-legal-tools/federal-register-sdk</b></a></td>
<td align="center"><a href="https://www.npmjs.com/package/@us-legal-tools/federal-register-sdk"><img src="https://img.shields.io/npm/v/@us-legal-tools/federal-register-sdk.svg" alt="npm version"></a></td>
<td>Federal Register documents and notices API</td>
</tr>
<tr>
<td><a href="./packages/courtlistener-sdk"><b>@us-legal-tools/courtlistener-sdk</b></a></td>
<td align="center"><a href="https://www.npmjs.com/package/@us-legal-tools/courtlistener-sdk"><img src="https://img.shields.io/npm/v/@us-legal-tools/courtlistener-sdk.svg" alt="npm version"></a></td>
<td>Legal opinions, PACER data, and judge info API</td>
</tr>
<tr>
<td><a href="./packages/govinfo-sdk"><b>@us-legal-tools/govinfo-sdk</b></a></td>
<td align="center"><a href="https://www.npmjs.com/package/@us-legal-tools/govinfo-sdk"><img src="https://img.shields.io/npm/v/@us-legal-tools/govinfo-sdk.svg" alt="npm version"></a></td>
<td>Government Publishing Office documents API</td>
</tr>
<tr>
<td><a href="./packages/dol-sdk"><b>@us-legal-tools/dol-sdk</b></a></td>
<td align="center"><a href="https://www.npmjs.com/package/@us-legal-tools/dol-sdk"><img src="https://img.shields.io/npm/v/@us-legal-tools/dol-sdk.svg" alt="npm version"></a></td>
<td>Department of Labor statistics and data API</td>
</tr>
</table>

## 📚 Key Features

### **[@us-legal-tools/ecfr-sdk](./packages/ecfr-sdk)** - Electronic Code of Federal Regulations
- Full text of all 50 CFR titles with advanced search
- Historical versions and change tracking
- MCP Server: `eCFRSDKServer`

### **[@us-legal-tools/federal-register-sdk](./packages/federal-register-sdk)** - Federal Register
- All documents published since 1994 with agency information
- Public inspection documents before publication
- MCP Server: `FederalRegisterServer`

### **[@us-legal-tools/courtlistener-sdk](./packages/courtlistener-sdk)** - CourtListener
- Millions of legal opinions from federal and state courts
- Judge profiles, oral arguments, PACER integration
- Citation lookup and docket alerts
- MCP Server: `CourtListenerRESTAPIServer`

### **[@us-legal-tools/govinfo-sdk](./packages/govinfo-sdk)** - GovInfo
- Congressional, judicial, and executive branch publications
- Full-text search with multiple download formats
- MCP Server: `GovInfoServer`

### **[@us-legal-tools/dol-sdk](./packages/dol-sdk)** - Department of Labor
- Employment, wages, inflation, and productivity statistics
- Industry-specific and geographic data
- MCP Server: `DOLDataServer`


## 📖 Usage Examples

### eCFR SDK

```typescript
import { getApiSearchV1Results } from '@us-legal-tools/ecfr-sdk';

// Search for regulations about "clean air"
const results = await getApiSearchV1Results({
  q: 'clean air',
  per_page: 10,
  page: 1
});

console.log(`Found ${results.count} regulations`);
results.results.forEach(result => {
  console.log(`- ${result.title}: ${result.label_string}`);
});
```

### Federal Register SDK

```typescript
import { getDocumentsFormat } from '@us-legal-tools/federal-register-sdk';

// Search for recent EPA rules
const documents = await getDocumentsFormat({
  format: 'json',
  conditions: {
    agencies: ['environmental-protection-agency'],
    type: ['RULE'],
    publication_date: {
      gte: '2024-01-01'
    }
  }
});

console.log(`Found ${documents.count} EPA rules in 2024`);
```

### CourtListener SDK

```typescript
import { getSearch } from '@us-legal-tools/courtlistener-sdk';

// Search for Supreme Court cases about free speech
const cases = await getSearch({
  type: 'o', // opinions
  q: 'free speech',
  court: 'scotus',
  order_by: 'score desc'
});

console.log(`Found ${cases.count} Supreme Court cases`);
cases.results.forEach(case => {
  console.log(`- ${case.caseName} (${case.dateFiled})`);
});
```

### GovInfo SDK

```typescript
import { createApiClient } from '@us-legal-tools/govinfo-sdk';

const client = createApiClient({
  headers: {
    'X-Api-Key': process.env.GOV_INFO_API_KEY
  }
});

// Search for recent legislation
const results = await client.searchPublished({
  query: 'infrastructure',
  pageSize: 10,
  offsetMark: '*',
  collection: 'BILLS'
});

console.log(`Found ${results.data.count} bills about infrastructure`);
```

### DOL SDK

```typescript
import { createApiClient } from '@us-legal-tools/dol-sdk';

const client = createApiClient({
  headers: {
    'X-API-KEY': process.env.DOL_API_KEY
  }
});

// Get available datasets
const datasets = await client.getDatasets();

console.log(`Available DOL datasets: ${datasets.data.datasets.length}`);
datasets.data.datasets.forEach(dataset => {
  console.log(`- ${dataset.dataset_title}`);
});
```

## 🤖 MCP (Model Context Protocol) Servers

Each SDK includes an MCP server that enables AI assistants to interact with these APIs. MCP servers provide a standardized way for AI tools to access external data sources.

### Running MCP Servers

```bash
# Run eCFR MCP Server
cd packages/ecfr-sdk
bun run mcp:server

# Run Federal Register MCP Server
cd packages/federal-register-sdk
bun run mcp:server

# Run CourtListener MCP Server (requires API token)
cd packages/courtlistener-sdk
COURTLISTENER_API_TOKEN=your-token bun run mcp:server

# Run GovInfo MCP Server (requires API key)
cd packages/govinfo-sdk
GOV_INFO_API_KEY=your-key bun run mcp:server

# Run DOL MCP Server (requires API key)
cd packages/dol-sdk
DOL_API_KEY=your-key bun run mcp:server
```

### MCP Integration Example

Configure your AI assistant (like Claude) to use these MCP servers:

```json
{
  "mcpServers": {
    "ecfr": {
      "command": "bunx",
      "args": ["@us-legal-tools/ecfr-sdk/mcp"]
    },
    "federal-register": {
      "command": "bunx", 
      "args": ["@us-legal-tools/federal-register-sdk/mcp"]
    },
    "courtlistener": {
      "command": "bunx",
      "args": ["@us-legal-tools/courtlistener-sdk/mcp"],
      "env": {
        "COURTLISTENER_API_TOKEN": "your-token"
      }
    },
    "govinfo": {
      "command": "bunx",
      "args": ["@us-legal-tools/govinfo-sdk/mcp"],
      "env": {
        "GOV_INFO_API_KEY": "your-key"
      }
    },
    "dol": {
      "command": "bunx",
      "args": ["@us-legal-tools/dol-sdk/mcp"],
      "env": {
        "DOL_API_KEY": "your-key"
      }
    }
  }
}
```

## 🔑 Authentication

### CourtListener API
Requires an API token from [CourtListener](https://www.courtlistener.com/). Set via:
- Environment variable: `COURTLISTENER_API_TOKEN`
- Or pass directly in API calls

### GovInfo API
Requires an API key from [GovInfo](https://api.govinfo.gov/docs/). Set via:
- Environment variable: `GOV_INFO_API_KEY`
- Or pass in request headers

### DOL API
Requires an API key from [DOL Developer](https://developer.dol.gov/). Set via:
- Environment variable: `DOL_API_KEY`
- Or pass in request headers

### eCFR & Federal Register APIs
No authentication required - these are public APIs.

## 🛠️ Development

This is a Turborepo monorepo using Bun for package management.

### Setup

```bash
# Clone the repository
git clone https://github.com/beshkenadze/us-legal-tools.git
cd ecfr-sdk

# Install dependencies
bun install

# Generate all SDKs
turbo generate

# Build all packages
turbo build

# Run tests
turbo test
```

### Project Structure

```
ecfr-sdk/
├── packages/
│   ├── ecfr-sdk/              # eCFR SDK
│   ├── federal-register-sdk/  # Federal Register SDK
│   ├── courtlistener-sdk/     # CourtListener SDK
│   ├── govinfo-sdk/           # GovInfo SDK
│   ├── dol-sdk/               # Department of Labor SDK
│   └── tsconfig/              # Shared TypeScript configs
├── turbo.json                 # Turborepo configuration
├── package.json               # Root package.json
├── biome.json                 # Code formatter/linter config
├── tsconfig.json              # Root TypeScript config
└── README.md                  # This file
```

### Adding a New SDK

1. Create a new package directory: `packages/your-sdk`
2. Add orval configuration for OpenAPI code generation
3. Configure TypeScript and build scripts
4. Add to root `tsconfig.json` references
5. Update this README

## 📋 Commands

```bash
# Install dependencies
bun install

# Generate all SDKs from OpenAPI specs
turbo generate

# Build all packages
turbo build

# Run tests
turbo test
turbo test:integration
turbo test:e2e

# Format and lint
turbo format
turbo lint
```

### Working with Packages

```bash
# Run a specific package's command
turbo run build --filter=@us-legal-tools/ecfr-sdk

# Work on a specific package
cd packages/ecfr-sdk
bun test
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🔗 Resources

### API Documentation
- [eCFR API Documentation](https://www.ecfr.gov/api/docs)
- [Federal Register API Documentation](https://www.federalregister.gov/developers/api/v1)
- [CourtListener API Documentation](https://www.courtlistener.com/help/api/rest/)
- [GovInfo API Documentation](https://api.govinfo.gov/docs/)
- [DOL API Documentation](https://developer.dol.gov/)

### Websites
- [eCFR Website](https://www.ecfr.gov/)
- [Federal Register Website](https://www.federalregister.gov/)
- [CourtListener Website](https://www.courtlistener.com/)
- [GovInfo Website](https://www.govinfo.gov/)
- [DOL Developer Portal](https://developer.dol.gov/)

### MCP Resources
- [Model Context Protocol](https://modelcontext.dev/)
- [Getting Started with Custom Connectors Using Remote MCP](https://support.anthropic.com/en/articles/11175166-getting-started-with-custom-connectors-using-remote-mcp)

## 👤 Author

**Aleksandr Beshkenadze <beshkenadze@gmail.com>**

- GitHub: [@beshkenadze](https://github.com/beshkenadze)

---

Built with ❤️ using [Turborepo](https://turbo.build/), [Bun](https://bun.sh/), and [Orval](https://orval.dev/)