# Federal Legal APIs Monorepo

A comprehensive TypeScript monorepo containing SDKs and Model Context Protocol (MCP) servers for major U.S. federal legal and regulatory APIs.

[![CI](https://github.com/beshkenadze/ecfr-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/beshkenadze/ecfr-sdk/actions/workflows/ci.yml)
[![Release](https://github.com/beshkenadze/ecfr-sdk/actions/workflows/release.yml/badge.svg)](https://github.com/beshkenadze/ecfr-sdk/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📦 Packages

This monorepo contains five powerful SDKs for accessing federal legal and government information:

### [@beshkenadze/ecfr-sdk](./packages/ecfr-sdk)
[![npm version](https://img.shields.io/npm/v/@beshkenadze/ecfr-sdk.svg)](https://www.npmjs.com/package/@beshkenadze/ecfr-sdk)

**Electronic Code of Federal Regulations (eCFR) SDK**

Access the complete, continuously updated digital version of the Code of Federal Regulations (CFR).

- 📖 **API Coverage**: Full text of all 50 CFR titles
- 🔍 **Search**: Advanced search across all federal regulations
- 📅 **Versioning**: Access historical versions and track changes
- 🏗️ **Structure**: Navigate hierarchical regulation structure
- 🤖 **MCP Server**: `eCFRSDKServer` for AI integration

### [@beshkenadze/federal-register-sdk](./packages/federal-register-sdk)
[![npm version](https://img.shields.io/npm/v/@beshkenadze/federal-register-sdk.svg)](https://www.npmjs.com/package/@beshkenadze/federal-register-sdk)

**Federal Register SDK**

Access the daily journal of the United States government, including all proposed and final rules, notices, and presidential documents.

- 📄 **Documents**: Search all documents published since 1994
- 🏛️ **Agencies**: Comprehensive agency information
- 📋 **Public Inspection**: Access documents before publication
- 🖼️ **Images**: Document images and metadata
- 🤖 **MCP Server**: `FederalRegisterServer` for AI integration

### [@beshkenadze/courtlistener-sdk](./packages/courtlistener-sdk)
[![npm version](https://img.shields.io/npm/v/@beshkenadze/courtlistener-sdk.svg)](https://www.npmjs.com/package/@beshkenadze/courtlistener-sdk)

**CourtListener SDK**

Access the largest free legal database, containing millions of legal opinions, oral arguments, judges, and more.

- ⚖️ **Case Law**: Millions of legal opinions from federal and state courts
- 👨‍⚖️ **Judges**: Comprehensive judge profiles and biographical data
- 🎙️ **Oral Arguments**: Audio recordings and metadata
- 📚 **Citations**: Advanced citation lookup and normalization
- 💼 **PACER Integration**: Access federal court dockets
- 🔔 **Alerts**: Track changes to cases and dockets
- 🤖 **MCP Server**: `CourtListenerRESTAPIServer` for AI integration

### [@beshkenadze/govinfo-sdk](./packages/govinfo-sdk)
[![npm version](https://img.shields.io/npm/v/@beshkenadze/govinfo-sdk.svg)](https://www.npmjs.com/package/@beshkenadze/govinfo-sdk)

**GovInfo SDK**

Access the U.S. Government Publishing Office's official repository for federal government information.

- 📚 **Collections**: Access to all Congressional, judicial, and executive branch publications
- 🔍 **Search**: Full-text search across all government documents
- 📄 **Download**: Multiple format options (PDF, XML, HTML, etc.)
- 🏛️ **Coverage**: Bills, laws, regulations, court opinions, and more
- 🤖 **MCP Server**: `GovInfoServer` for AI integration

### [@beshkenadze/dol-sdk](./packages/dol-sdk)
[![npm version](https://img.shields.io/npm/v/@beshkenadze/dol-sdk.svg)](https://www.npmjs.com/package/@beshkenadze/dol-sdk)

**Department of Labor (DOL) SDK**

Access comprehensive labor statistics and datasets from the U.S. Department of Labor.

- 📊 **Statistics**: Employment, wages, inflation, and productivity data
- 📈 **Time Series**: Historical labor market data
- 🏭 **Industries**: Detailed industry-specific statistics
- 🗺️ **Geography**: State and metropolitan area data
- 🤖 **MCP Server**: `DOLDataServer` for AI integration

## 🚀 Installation

Each SDK can be installed independently from npm:

```bash
# eCFR SDK
npm install @beshkenadze/ecfr-sdk

# Federal Register SDK  
npm install @beshkenadze/federal-register-sdk

# CourtListener SDK
npm install @beshkenadze/courtlistener-sdk

# GovInfo SDK
npm install @beshkenadze/govinfo-sdk

# DOL SDK
npm install @beshkenadze/dol-sdk
```

Or using other package managers:

```bash
# Using Bun
bun add @beshkenadze/ecfr-sdk

# Using Yarn
yarn add @beshkenadze/federal-register-sdk

# Using PNPM
pnpm add @beshkenadze/courtlistener-sdk
```

## 📖 Quick Start

### eCFR SDK

```typescript
import { getApiSearchV1Results } from '@beshkenadze/ecfr-sdk';

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
import { getDocumentsFormat } from '@beshkenadze/federal-register-sdk';

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
import { getSearch } from '@beshkenadze/courtlistener-sdk';

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
import { createApiClient } from '@beshkenadze/govinfo-sdk';

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
import { createApiClient } from '@beshkenadze/dol-sdk';

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
      "args": ["@beshkenadze/ecfr-sdk/mcp"]
    },
    "federal-register": {
      "command": "bunx", 
      "args": ["@beshkenadze/federal-register-sdk/mcp"]
    },
    "courtlistener": {
      "command": "bunx",
      "args": ["@beshkenadze/courtlistener-sdk/mcp"],
      "env": {
        "COURTLISTENER_API_TOKEN": "your-token"
      }
    },
    "govinfo": {
      "command": "bunx",
      "args": ["@beshkenadze/govinfo-sdk/mcp"],
      "env": {
        "GOV_INFO_API_KEY": "your-key"
      }
    },
    "dol": {
      "command": "bunx",
      "args": ["@beshkenadze/dol-sdk/mcp"],
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
git clone https://github.com/beshkenadze/ecfr-sdk.git
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
│   ├── ecfr-sdk/              # eCFR SDK package
│   ├── federal-register-sdk/  # Federal Register SDK package
│   ├── courtlistener-sdk/     # CourtListener SDK package
│   ├── govinfo-sdk/           # GovInfo SDK package
│   └── dol-sdk/               # Department of Labor SDK package
├── turbo.json                 # Turborepo configuration
├── package.json               # Root package.json
└── README.md                  # This file
```

### Adding a New SDK

1. Create a new package directory: `packages/your-sdk`
2. Add orval configuration for OpenAPI code generation
3. Configure TypeScript and build scripts
4. Add to root `tsconfig.json` references
5. Update this README

## 📋 API Coverage

### eCFR API Features
- ✅ Full regulation text retrieval
- ✅ Advanced search with faceting
- ✅ Historical version access
- ✅ Hierarchical navigation
- ✅ Citation lookup
- ✅ Recent changes tracking

### Federal Register API Features
- ✅ Document search and retrieval
- ✅ Agency information
- ✅ Public inspection documents
- ✅ Presidential documents
- ✅ Document images
- ✅ Suggested searches

### CourtListener API Features
- ✅ Opinion full-text search
- ✅ Case metadata and citations
- ✅ Judge biographical data
- ✅ Oral argument audio
- ✅ PACER document access
- ✅ Financial disclosures
- ✅ Docket alerts
- ✅ Citation normalization

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

- [eCFR Website](https://www.ecfr.gov/)
- [Federal Register Website](https://www.federalregister.gov/)
- [CourtListener Website](https://www.courtlistener.com/)
- [Model Context Protocol](https://modelcontext.dev/)

## 👤 Author

**Akira Beshkenadze**

- GitHub: [@beshkenadze](https://github.com/beshkenadze)

## 🙏 Acknowledgments

- [Free Law Project](https://free.law/) for CourtListener
- U.S. Government Publishing Office for eCFR and Federal Register APIs
- [Anthropic](https://anthropic.com/) for Model Context Protocol

---

Built with ❤️ using [Turborepo](https://turbo.build/), [Bun](https://bun.sh/), and [Orval](https://orval.dev/)