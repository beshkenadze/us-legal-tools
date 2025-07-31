<div align="center">
  <h1>@us-legal-tools/courtlistener-sdk</h1>
  <p>
    <strong>TypeScript SDK and MCP server for CourtListener - the largest free legal database</strong>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/@us-legal-tools/courtlistener-sdk">
      <img alt="npm version" src="https://img.shields.io/npm/v/@us-legal-tools/courtlistener-sdk.svg?style=for-the-badge">
    </a>
    <a href="https://www.npmjs.com/package/@us-legal-tools/courtlistener-sdk">
      <img alt="npm downloads" src="https://img.shields.io/npm/dm/@us-legal-tools/courtlistener-sdk.svg?style=for-the-badge">
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
    <a href="#authentication">Authentication</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#api-reference">API</a> •
    <a href="#mcp-server">MCP Server</a> •
    <a href="https://www.courtlistener.com/help/api/">CourtListener API Docs</a>
  </p>
</div>

## Features

- ⚖️ **Case Law** - Access millions of legal opinions from federal and state courts
- 👨‍⚖️ **Judge Data** - Comprehensive judge profiles and biographical information
- 🎙️ **Oral Arguments** - Audio recordings with metadata
- 📚 **Citation Tools** - Advanced citation lookup and normalization
- 💼 **PACER Integration** - Federal court docket access
- 🔔 **Real-time Alerts** - Track changes to cases and dockets
- 🤖 **MCP Server** - AI-ready server for integration with Claude and other AI assistants
- 🔍 **Advanced Search** - Powerful search with Elasticsearch backend
- ✨ **Type-safe** - Full TypeScript support with auto-completion

## Installation

```bash
# npm
npm install @us-legal-tools/courtlistener-sdk

# yarn
yarn add @us-legal-tools/courtlistener-sdk

# pnpm
pnpm add @us-legal-tools/courtlistener-sdk

# bun
bun add @us-legal-tools/courtlistener-sdk
```

## Authentication

The CourtListener API requires authentication for most endpoints. Get your API token from [CourtListener](https://www.courtlistener.com/help/api/rest/#authentication).

```typescript
// Set via environment variable
process.env.COURTLISTENER_API_TOKEN = 'your-token';

// Or configure the axios instance directly
import { axiosInstance } from '@us-legal-tools/courtlistener-sdk';
axiosInstance.defaults.headers.common['Authorization'] = 'Token your-token';
```

## Quick Start

### Basic Search

```typescript
import { getSearch } from '@us-legal-tools/courtlistener-sdk';

// Search for Supreme Court cases
const results = await getSearch({
  type: 'o', // 'o' for opinions
  q: 'miranda rights',
  court: 'scotus',
  order_by: 'score desc'
});

console.log(`Found ${results.count} cases`);
results.results.forEach(result => {
  console.log(`- ${result.caseName} (${result.dateFiled})`);
});
```

### Get Case Details

```typescript
import { getOpinionsId } from '@us-legal-tools/courtlistener-sdk';

// Get a specific opinion
const opinion = await getOpinionsId({ id: 123456 });

console.log(`Case: ${opinion.case_name}`);
console.log(`Court: ${opinion.court}`);
console.log(`Date: ${opinion.date_filed}`);
console.log(`Text: ${opinion.plain_text || opinion.html}`);
```

### Search Judges

```typescript
import { getSearch } from '@us-legal-tools/courtlistener-sdk';

// Search for judges
const judges = await getSearch({
  type: 'p', // 'p' for people/judges
  q: 'Ruth Bader Ginsburg',
  order_by: 'name_reverse asc'
});

judges.results.forEach(judge => {
  console.log(`${judge.name_full} - ${judge.court}`);
});
```

### Get Audio Recordings

```typescript
import { getAudio } from '@us-legal-tools/courtlistener-sdk';

// Get oral arguments
const audio = await getAudio({
  docket__court: 'scotus',
  argued_after: '2023-01-01'
});

audio.results.forEach(recording => {
  console.log(`${recording.case_name} - ${recording.date_argued}`);
  console.log(`Audio: ${recording.download_url}`);
});
```

## API Reference

### Search Endpoints

- `getSearch` - Universal search endpoint for all content types
- `getSearchV4OpinionsClusters` - Search opinion clusters
- `getSearchV4People` - Search judges and people
- `getSearchV4OralArguments` - Search oral arguments

### Opinion Endpoints

- `getOpinions` - List opinions
- `getOpinionsId` - Get specific opinion
- `getClusters` - List opinion clusters
- `getClustersId` - Get specific cluster

### Judge/Person Endpoints

- `getPeople` - List judges and people
- `getPeopleId` - Get specific person details
- `getPersonDisclosures` - Get financial disclosures

### Docket Endpoints

- `getDockets` - List dockets
- `getDocketsId` - Get specific docket
- `getDocketEntries` - List docket entries
- `getDocketAlerts` - Manage docket alerts

### Audio Endpoints

- `getAudio` - List audio recordings
- `getAudioId` - Get specific audio recording

### Citation Endpoints

- `getCitations` - Citation lookup
- `getCitationNormalize` - Normalize citations

## MCP Server

The MCP server allows AI assistants to interact with the CourtListener API.

### Running the Server

```bash
# Using the SDK directly (requires COURTLISTENER_API_TOKEN env var)
COURTLISTENER_API_TOKEN=your-token npx @us-legal-tools/courtlistener-sdk/mcp

# Or if installed locally
cd node_modules/@us-legal-tools/courtlistener-sdk
COURTLISTENER_API_TOKEN=your-token npm run mcp:server
```

### Integration with Claude

Add to your Claude configuration:

```json
{
  "mcpServers": {
    "courtlistener": {
      "command": "npx",
      "args": ["@us-legal-tools/courtlistener-sdk/mcp"],
      "env": {
        "COURTLISTENER_API_TOKEN": "your-token"
      }
    }
  }
}
```

## Search Types

Use the following types with the search endpoint:

- `o` - Opinions
- `r` - RECAP Archive
- `d` - Dockets
- `p` - People/Judges
- `oa` - Oral Arguments
- `opinion-cluster` - Opinion Clusters

## Advanced Search

```typescript
import { getSearch } from '@us-legal-tools/courtlistener-sdk';

// Complex search with filters
const results = await getSearch({
  type: 'o',
  q: 'first amendment',
  court: 'ca9 ca10 cafc',  // Multiple courts
  filed_after: '2020-01-01',
  filed_before: '2023-12-31',
  cited_gt: 50,  // Cited more than 50 times
  order_by: 'dateFiled desc',
  highlight: true
});
```

## Error Handling

```typescript
import { getOpinionsId } from '@us-legal-tools/courtlistener-sdk';

try {
  const opinion = await getOpinionsId({ id: 123456 });
} catch (error) {
  if (error.response?.status === 401) {
    console.error('Invalid API token');
  } else if (error.response?.status === 404) {
    console.error('Opinion not found');
  } else if (error.response?.status === 429) {
    console.error('Rate limit exceeded');
  } else {
    console.error('API error:', error.message);
  }
}
```

## Rate Limiting

CourtListener has rate limits based on your account type. Free accounts are limited to 5,000 requests per day.

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

- [npm Package](https://www.npmjs.com/package/@us-legal-tools/courtlistener-sdk)
- [GitHub Repository](https://github.com/beshkenadze/us-legal-tools)
- [CourtListener Website](https://www.courtlistener.com/)
- [CourtListener API Documentation](https://www.courtlistener.com/help/api/)
- [Report Issues](https://github.com/beshkenadze/us-legal-tools/issues/new?labels=bug&template=bug-report.md)
- [Request Features](https://github.com/beshkenadze/us-legal-tools/issues/new?labels=enhancement&template=feature-request.md)

## Support

Need help? Check out our [documentation](https://github.com/beshkenadze/us-legal-tools) or [create an issue](https://github.com/beshkenadze/us-legal-tools/issues/new/choose).

<p align="right">(<a href="#readme-top">back to top</a>)</p>