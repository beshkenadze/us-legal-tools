# @beshkenadze/courtlistener-sdk

TypeScript SDK and MCP (Model Context Protocol) server for the CourtListener API - the largest free legal database.

[![npm version](https://img.shields.io/npm/v/@beshkenadze/courtlistener-sdk.svg)](https://www.npmjs.com/package/@beshkenadze/courtlistener-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- ⚖️ **Case Law** - Access millions of legal opinions from federal and state courts
- 👨‍⚖️ **Judge Data** - Comprehensive judge profiles and biographical information
- 🎙️ **Oral Arguments** - Audio recordings with metadata
- 📚 **Citation Tools** - Advanced citation lookup and normalization
- 💼 **PACER Integration** - Federal court docket access
- 🔔 **Real-time Alerts** - Track changes to cases and dockets
- 🤖 **MCP Server** - AI-ready server for integration with Claude and other AI assistants
- 🔍 **Advanced Search** - Powerful search with Elasticsearch backend

## Installation

```bash
# npm
npm install @beshkenadze/courtlistener-sdk

# yarn
yarn add @beshkenadze/courtlistener-sdk

# pnpm
pnpm add @beshkenadze/courtlistener-sdk

# bun
bun add @beshkenadze/courtlistener-sdk
```

## Authentication

The CourtListener API requires authentication for most endpoints. Get your API token from [CourtListener](https://www.courtlistener.com/help/api/rest/#authentication).

```typescript
// Set via environment variable
process.env.COURTLISTENER_API_TOKEN = 'your-token';

// Or configure the axios instance directly
import { axiosInstance } from '@beshkenadze/courtlistener-sdk';
axiosInstance.defaults.headers.common['Authorization'] = 'Token your-token';
```

## Quick Start

### Basic Search

```typescript
import { getSearch } from '@beshkenadze/courtlistener-sdk';

// Search for Supreme Court cases
const results = await getSearch({
  type: 'o', // opinions
  q: 'first amendment',
  court: 'scotus',
  order_by: 'score desc',
  highlight: 'text'
});

console.log(`Found ${results.count} cases`);
results.results.forEach(result => {
  console.log(`- ${result.caseName} (${result.dateFiled})`);
  if (result.snippet) {
    console.log(`  Snippet: ${result.snippet}`);
  }
});
```

### Citation Lookup

```typescript
import { postCitationLookup } from '@beshkenadze/courtlistener-sdk';

// Look up citations
const citations = await postCitationLookup({
  text: 'I need the case at 410 U.S. 113 and also 5 F.3d 1234.',
  html: false
});

console.log('Found citations:');
citations.citations.forEach(cite => {
  console.log(`- ${cite.normalized_cite}: ${cite.case_name}`);
  console.log(`  Court: ${cite.court}`);
  console.log(`  URL: ${cite.absolute_url}`);
});
```

### Judge Information

```typescript
import { getPeople, getPositions } from '@beshkenadze/courtlistener-sdk';

// Search for judges
const judges = await getPeople({
  name_last: 'Roberts',
  court: 'scotus'
});

// Get judge positions
for (const judge of judges.results) {
  const positions = await getPositions({
    person: judge.id
  });
  
  positions.results.forEach(pos => {
    console.log(`${judge.name_full}: ${pos.position_type} at ${pos.court_name}`);
  });
}
```

### Docket Monitoring

```typescript
import { getDockets, postDocketAlerts } from '@beshkenadze/courtlistener-sdk';

// Search for dockets
const dockets = await getDockets({
  q: 'Google',
  court: 'cafc',
  order_by: 'date_created desc'
});

// Create alert for a docket
if (dockets.results.length > 0) {
  const alert = await postDocketAlerts({
    docket: dockets.results[0].id,
    alert_type: 'subscription'
  });
  
  console.log('Alert created:', alert.id);
}
```

## API Reference

### Search Endpoints

- `getSearch` - Universal search across all content types
- `getOpinions` - Search legal opinions
- `getDockets` - Search dockets
- `getAudio` - Search oral arguments

### Case Law Endpoints

- `getClusters` - Get opinion clusters
- `getOpinions` - Get individual opinions
- `getCitations` - Get citation objects

### People & Courts

- `getPeople` - Search judges and parties
- `getPositions` - Get judge positions
- `getCourts` - Get court information
- `getPoliticalAffiliations` - Get political data

### Financial Disclosures

- `getFinancialDisclosures` - Judge financial disclosures
- `getInvestments` - Investment records
- `getPositions` - Position holdings
- `getGifts` - Gift disclosures

### PACER & RECAP

- `getRecap` - RECAP document archive
- `postRecapFetch` - Request PACER documents

### Alerts & Monitoring

- `getAlerts` - Manage search alerts
- `getDocketAlerts` - Manage docket alerts

## MCP Server

The MCP server allows AI assistants to interact with the CourtListener API.

### Running the Server

```bash
# With authentication token
COURTLISTENER_API_TOKEN=your-token npx @beshkenadze/courtlistener-sdk/mcp

# Or if installed locally
cd node_modules/@beshkenadze/courtlistener-sdk
COURTLISTENER_API_TOKEN=your-token npm run mcp:server
```

### Integration with Claude

Add to your Claude configuration:

```json
{
  "mcpServers": {
    "courtlistener": {
      "command": "npx",
      "args": ["@beshkenadze/courtlistener-sdk/mcp"],
      "env": {
        "COURTLISTENER_API_TOKEN": "your-token"
      }
    }
  }
}
```

## Search Types

When using the universal search endpoint, specify the type:

- `o` - Opinions
- `r` - RECAP documents
- `d` - Dockets
- `p` - People (judges)
- `oa` - Oral arguments

## Advanced Search Syntax

CourtListener supports advanced search operators:

```typescript
// Proximity search
q: '"patent infringement"~10'  // Within 10 words

// Field-specific search
q: 'caseName:"Apple v. Samsung"'

// Boolean operators
q: 'copyright AND (fair use OR transformative)'

// Date ranges
q: 'dateFiled:[2020-01-01 TO 2024-12-31]'
```

## Rate Limiting

CourtListener has rate limits based on your account type:
- Free tier: 5,000 requests/day
- Membership tiers: Higher limits available

The SDK includes automatic retry logic for rate-limited requests.

## Error Handling

```typescript
import { getSearch } from '@beshkenadze/courtlistener-sdk';

try {
  const results = await getSearch({
    type: 'o',
    q: 'search term'
  });
} catch (error) {
  if (error.response?.status === 401) {
    console.error('Invalid API token');
  } else if (error.response?.status === 429) {
    console.error('Rate limit exceeded');
  } else {
    console.error('API error:', error.message);
  }
}
```

## License

MIT License - see [LICENSE](../../LICENSE) for details

## Links

- [GitHub Repository](https://github.com/beshkenadze/ecfr-sdk)
- [npm Package](https://www.npmjs.com/package/@beshkenadze/courtlistener-sdk)
- [CourtListener Website](https://www.courtlistener.com/)
- [CourtListener API Documentation](https://www.courtlistener.com/help/api/rest/)
- [Free Law Project](https://free.law/)