<div align="center">
  <h1>@us-legal-tools/federal-register-sdk</h1>
  <p>
    <strong>TypeScript SDK and MCP server for the Federal Register API</strong>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/@us-legal-tools/federal-register-sdk">
      <img alt="npm version" src="https://img.shields.io/npm/v/@us-legal-tools/federal-register-sdk.svg?style=for-the-badge">
    </a>
    <a href="https://www.npmjs.com/package/@us-legal-tools/federal-register-sdk">
      <img alt="npm downloads" src="https://img.shields.io/npm/dm/@us-legal-tools/federal-register-sdk.svg?style=for-the-badge">
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
    <a href="https://www.federalregister.gov/developers/api/v1">Federal Register API Docs</a>
  </p>
</div>

## Features

- 📄 **Document Access** - Search and retrieve all Federal Register documents since 1994
- 🏛️ **Agency Data** - Complete information about federal agencies
- 📋 **Public Inspection** - Access documents before official publication
- 🖼️ **Document Images** - Retrieve document images and metadata
- 🤖 **MCP Server** - AI-ready server for integration with Claude and other AI assistants
- 🔍 **Advanced Search** - Powerful search with faceting and filtering
- ✨ **Type-safe** - Full TypeScript support with auto-completion
- 🚀 **Fast & Lightweight** - Minimal dependencies, optimized for performance

## Installation

```bash
# npm
npm install @us-legal-tools/federal-register-sdk

# yarn
yarn add @us-legal-tools/federal-register-sdk

# pnpm
pnpm add @us-legal-tools/federal-register-sdk

# bun
bun add @us-legal-tools/federal-register-sdk
```

## Quick Start

### Basic Usage

```typescript
import { getDocumentsFormat, getAgencies } from '@us-legal-tools/federal-register-sdk';

// Search for documents
const documents = await getDocumentsFormat({
  format: 'json',
  per_page: 10,
  conditions: {
    term: 'climate change'
  }
});

console.log(`Found ${documents.count} documents`);
documents.results.forEach(doc => {
  console.log(`- ${doc.title} (${doc.publication_date})`);
});

// Get all agencies
const agencies = await getAgencies();
console.log(`Total agencies: ${agencies.length}`);
```

### Advanced Search

```typescript
import { getDocumentsFormat } from '@us-legal-tools/federal-register-sdk';

// Search with multiple filters
const results = await getDocumentsFormat({
  format: 'json',
  conditions: {
    agencies: ['environmental-protection-agency', 'energy-department'],
    type: ['RULE', 'PRORULE'],
    publication_date: {
      gte: '2024-01-01',
      lte: '2024-12-31'
    },
    significant: '1'
  },
  order: 'newest',
  per_page: 20
});

// Access facets for refinement
console.log('Available facets:', results.aggregations);
```

### Document Details

```typescript
import { getDocumentsDocumentNumberFormat } from '@us-legal-tools/federal-register-sdk';

// Get a specific document
const document = await getDocumentsDocumentNumberFormat({
  documentNumber: '2024-12345',
  format: 'json'
});

console.log(`Title: ${document.title}`);
console.log(`Agency: ${document.agencies.map(a => a.name).join(', ')}`);
console.log(`Published: ${document.publication_date}`);
console.log(`PDF URL: ${document.pdf_url}`);
```

### Public Inspection Documents

```typescript
import { getPublicInspectionDocumentsCurrentFormat } from '@us-legal-tools/federal-register-sdk';

// Get current public inspection documents
const piDocuments = await getPublicInspectionDocumentsCurrentFormat({
  format: 'json'
});

console.log('Documents on public inspection:');
piDocuments.results.forEach(doc => {
  console.log(`- ${doc.title} (Filing date: ${doc.filing_date})`);
});
```

## API Reference

### Document Endpoints

- `getDocumentsFormat` - Search all documents
- `getDocumentsDocumentNumberFormat` - Get a specific document
- `getDocumentsDocumentNumbersFormat` - Get multiple documents by number
- `getDocumentsFacetsFacet` - Get document counts by facet

### Public Inspection Endpoints

- `getPublicInspectionDocumentsFormat` - Search public inspection documents
- `getPublicInspectionDocumentsCurrentFormat` - Get current PI documents
- `getPublicInspectionDocumentsDocumentNumberFormat` - Get specific PI document

### Agency Endpoints

- `getAgencies` - Get all agencies
- `getAgenciesSlug` - Get specific agency details

### Other Endpoints

- `getIssuesPublicationDateFormat` - Get table of contents for a date
- `getImagesIdentifier` - Get image metadata
- `getSuggestedSearches` - Get suggested searches

## MCP Server

The MCP server allows AI assistants to interact with the Federal Register API.

### Running the Server

```bash
# Using the SDK directly
npx @us-legal-tools/federal-register-sdk/mcp

# Or if installed locally
cd node_modules/@us-legal-tools/federal-register-sdk
npm run mcp:server
```

### Integration with Claude

Add to your Claude configuration:

```json
{
  "mcpServers": {
    "federal-register": {
      "command": "npx",
      "args": ["@us-legal-tools/federal-register-sdk/mcp"]
    }
  }
}
```

## Document Types

The API supports these document types:

- `RULE` - Final rules
- `PRORULE` - Proposed rules
- `NOTICE` - Notices
- `PRESDOCU` - Presidential documents

## Date Formats

Dates should be provided in ISO format (YYYY-MM-DD):

```typescript
const results = await getDocumentsFormat({
  format: 'json',
  conditions: {
    publication_date: {
      gte: '2024-01-01',
      lte: '2024-12-31'
    }
  }
});
```

## Error Handling

```typescript
import { getDocumentsFormat } from '@us-legal-tools/federal-register-sdk';

try {
  const results = await getDocumentsFormat({
    format: 'json',
    per_page: 10
  });
} catch (error) {
  if (error.response?.status === 400) {
    console.error('Invalid request parameters');
  } else if (error.response?.status === 429) {
    console.error('Rate limit exceeded');
  } else {
    console.error('API error:', error.message);
  }
}
```

## Rate Limiting

The Federal Register API has rate limits. The SDK automatically includes appropriate headers, but be mindful of making too many requests in a short period.

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

- [npm Package](https://www.npmjs.com/package/@us-legal-tools/federal-register-sdk)
- [GitHub Repository](https://github.com/beshkenadze/us-legal-tools)
- [Federal Register Website](https://www.federalregister.gov/)
- [Federal Register API Documentation](https://www.federalregister.gov/developers/api/v1)
- [Report Issues](https://github.com/beshkenadze/us-legal-tools/issues/new?labels=bug&template=bug-report.md)
- [Request Features](https://github.com/beshkenadze/us-legal-tools/issues/new?labels=enhancement&template=feature-request.md)

## Support

Need help? Check out our [documentation](https://github.com/beshkenadze/us-legal-tools) or [create an issue](https://github.com/beshkenadze/us-legal-tools/issues/new/choose).

<p align="right">(<a href="#readme-top">back to top</a>)</p>