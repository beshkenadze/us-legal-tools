# Federal Legal APIs Monorepo

A comprehensive TypeScript monorepo containing SDKs and Model Context Protocol (MCP) servers for major U.S. federal legal and regulatory APIs.

[![CI](https://github.com/beshkenadze/ecfr-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/beshkenadze/ecfr-sdk/actions/workflows/ci.yml)
[![Release](https://github.com/beshkenadze/ecfr-sdk/actions/workflows/release.yml/badge.svg)](https://github.com/beshkenadze/ecfr-sdk/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📦 Packages

This monorepo contains three powerful SDKs for accessing federal legal information:

### [@beshkenadze/ecfr-sdk](./packages/ecfr-sdk)
[![npm version](https://badge.fury.io/js/@beshkenadze%2Fecfr-sdk.svg)](https://badge.fury.io/js/@beshkenadze%2Fecfr-sdk)

**Electronic Code of Federal Regulations (eCFR) SDK**

Access the complete, continuously updated digital version of the Code of Federal Regulations (CFR).

- 📖 **API Coverage**: Full text of all 50 CFR titles
- 🔍 **Search**: Advanced search across all federal regulations
- 📅 **Versioning**: Access historical versions and track changes
- 🏗️ **Structure**: Navigate hierarchical regulation structure
- 🤖 **MCP Server**: `eCFRSDKServer` for AI integration

### [@beshkenadze/federal-register-sdk](./packages/federal-register-sdk)
[![npm version](https://badge.fury.io/js/@beshkenadze%2Ffederal-register-sdk.svg)](https://badge.fury.io/js/@beshkenadze%2Ffederal-register-sdk)

**Federal Register SDK**

Access the daily journal of the United States government, including all proposed and final rules, notices, and presidential documents.

- 📄 **Documents**: Search all documents published since 1994
- 🏛️ **Agencies**: Comprehensive agency information
- 📋 **Public Inspection**: Access documents before publication
- 🖼️ **Images**: Document images and metadata
- 🤖 **MCP Server**: `FederalRegisterServer` for AI integration

### [@beshkenadze/courtlistener-sdk](./packages/courtlistener-sdk)
[![npm version](https://badge.fury.io/js/@beshkenadze%2Fcourtlistener-sdk.svg)](https://badge.fury.io/js/@beshkenadze%2Fcourtlistener-sdk)

**CourtListener SDK**

Access the largest free legal database, containing millions of legal opinions, oral arguments, judges, and more.

- ⚖️ **Case Law**: Millions of legal opinions from federal and state courts
- 👨‍⚖️ **Judges**: Comprehensive judge profiles and biographical data
- 🎙️ **Oral Arguments**: Audio recordings and metadata
- 📚 **Citations**: Advanced citation lookup and normalization
- 💼 **PACER Integration**: Access federal court dockets
- 🔔 **Alerts**: Track changes to cases and dockets
- 🤖 **MCP Server**: `CourtListenerRESTAPIServer` for AI integration

## 🚀 Installation

Each SDK can be installed independently from npm:

```bash
# eCFR SDK
npm install @beshkenadze/ecfr-sdk

# Federal Register SDK  
npm install @beshkenadze/federal-register-sdk

# CourtListener SDK
npm install @beshkenadze/courtlistener-sdk
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
    }
  }
}
```

## 🔑 Authentication

### CourtListener API
Requires an API token from [CourtListener](https://www.courtlistener.com/). Set via:
- Environment variable: `COURTLISTENER_API_TOKEN`
- Or pass directly in API calls

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
│   ├── ecfr-sdk/           # eCFR SDK package
│   ├── federal-register-sdk/ # Federal Register SDK package
│   └── courtlistener-sdk/   # CourtListener SDK package
├── turbo.json              # Turborepo configuration
├── package.json            # Root package.json
└── README.md              # This file
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