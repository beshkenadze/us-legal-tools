# @beshkenadze/federal-register-sdk

TypeScript SDK and MCP (Model Context Protocol) server for the Federal Register API.

[![npm version](https://img.shields.io/npm/v/@beshkenadze/federal-register-sdk.svg)](https://www.npmjs.com/package/@beshkenadze/federal-register-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 📄 **Document Access** - Search and retrieve all Federal Register documents since 1994
- 🏛️ **Agency Data** - Complete information about federal agencies
- 📋 **Public Inspection** - Access documents before official publication
- 🖼️ **Document Images** - Retrieve document images and metadata
- 🤖 **MCP Server** - AI-ready server for integration with Claude and other AI assistants
- 🔍 **Advanced Search** - Powerful search with faceting and filtering
- ✨ **Type-safe** - Full TypeScript support with auto-completion

## Installation

```bash
# npm
npm install @beshkenadze/federal-register-sdk

# yarn
yarn add @beshkenadze/federal-register-sdk

# pnpm
pnpm add @beshkenadze/federal-register-sdk

# bun
bun add @beshkenadze/federal-register-sdk
```

## Quick Start

### Basic Usage

```typescript
import { getDocumentsFormat, getAgencies } from '@beshkenadze/federal-register-sdk';

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
import { getDocumentsFormat } from '@beshkenadze/federal-register-sdk';

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
import { getDocumentsDocumentNumberFormat } from '@beshkenadze/federal-register-sdk';

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
import { getPublicInspectionDocumentsCurrentFormat } from '@beshkenadze/federal-register-sdk';

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
npx @beshkenadze/federal-register-sdk/mcp

# Or if installed locally
cd node_modules/@beshkenadze/federal-register-sdk
npm run mcp:server
```

### Integration with Claude

Add to your Claude configuration:

```json
{
  "mcpServers": {
    "federal-register": {
      "command": "npx",
      "args": ["@beshkenadze/federal-register-sdk/mcp"]
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
import { getDocumentsFormat } from '@beshkenadze/federal-register-sdk';

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

## License

MIT License - see [LICENSE](../../LICENSE) for details

## Links

- [GitHub Repository](https://github.com/beshkenadze/ecfr-sdk)
- [npm Package](https://www.npmjs.com/package/@beshkenadze/federal-register-sdk)
- [Federal Register Website](https://www.federalregister.gov/)
- [Federal Register API Documentation](https://www.federalregister.gov/developers/api/v1)