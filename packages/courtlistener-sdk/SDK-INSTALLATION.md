# CourtListener SDK Installation Guide

This guide covers how to install and use the generated CourtListener SDK in your projects.

## Installation

### NPM/Yarn/Bun

```bash
# Using npm
npm install courtlistener-sdk

# Using yarn  
yarn add courtlistener-sdk

# Using bun
bun add courtlistener-sdk
```

## Basic Usage

### Standard SDK (Fetch-based)

```typescript
import { createClient, searchDocuments } from 'courtlistener-sdk';

// Create a client with your API key
const client = createClient({
  baseUrl: 'https://www.courtlistener.com/api/rest/v4',
  headers: {
    'Authorization': 'Token your-api-key-here'
  }
});

// Search for legal documents
const results = await searchDocuments({
  client,
  query: {
    q: 'constitutional law',
    type: 'o'  // opinions
  }
});
```

## React/TanStack Query Integration

If you're using React, the SDK provides TanStack Query hooks for better data fetching and caching.

### Prerequisites

Install TanStack Query in your React project:

```bash
npm install @tanstack/react-query
```

### Setup Query Client

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
    </QueryClientProvider>
  );
}
```

### Configure API Client

```tsx
import { client } from 'courtlistener-sdk';

// Configure the client globally
client.setConfig({
  baseUrl: 'https://www.courtlistener.com/api/rest/v4',
  headers: {
    'Authorization': 'Token your-api-key-here'
  }
});
```

### Using Query Hooks

```tsx
import { useSearchDocumentsQuery } from 'courtlistener-sdk';

function SearchComponent() {
  const { data, isLoading, error } = useSearchDocumentsQuery({
    query: {
      q: 'constitutional law',
      type: 'o'
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Search Results ({data?.count})</h2>
      {data?.results?.map((result) => (
        <div key={result.id}>
          <h3>{result.caseName}</h3>
          <p>{result.court} - {result.dateFiled}</p>
        </div>
      ))}
    </div>
  );
}
```

### Using Mutation Hooks

```tsx
import { useLookupCitationsMutation } from 'courtlistener-sdk';

function CitationLookupComponent() {
  const lookupMutation = useLookupCitationsMutation();

  const handleLookup = async () => {
    try {
      const result = await lookupMutation.mutateAsync({
        body: {
          text: 'Brown v. Board of Education, 347 U.S. 483 (1954)'
        }
      });
      console.log('Citation results:', result);
    } catch (error) {
      console.error('Lookup failed:', error);
    }
  };

  return (
    <button 
      onClick={handleLookup}
      disabled={lookupMutation.isPending}
    >
      {lookupMutation.isPending ? 'Looking up...' : 'Lookup Citation'}
    </button>
  );
}
```

### Infinite Queries (Pagination)

For endpoints that support pagination, use infinite query hooks:

```tsx
import { useListOpinionsInfiniteQuery } from 'courtlistener-sdk';

function OpinionsListComponent() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useListOpinionsInfiniteQuery({
    query: {
      ordering: '-date_created'
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.results?.map((opinion) => (
            <div key={opinion.id}>
              <h3>{opinion.cluster?.case_name}</h3>
              <p>{opinion.type}</p>
            </div>
          ))}
        </div>
      ))}
      
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

## Authentication

### API Token

Get your API token from [CourtListener.com](https://www.courtlistener.com/api/) and configure it:

```typescript
import { client } from 'courtlistener-sdk';

client.setConfig({
  baseUrl: 'https://www.courtlistener.com/api/rest/v4',
  headers: {
    'Authorization': 'Token your-api-key-here'
  }
});
```

### Environment Variables

For security, store your API key in environment variables:

```bash
# .env
COURTLISTENER_API_KEY=your_api_key_here
```

```typescript
client.setConfig({
  baseUrl: 'https://www.courtlistener.com/api/rest/v4',
  headers: {
    'Authorization': `Token ${process.env.COURTLISTENER_API_KEY}`
  }
});
```

## Available Endpoints

The SDK provides functions for all CourtListener API endpoints:

### Search
- `searchDocuments()` / `useSearchDocumentsQuery()`

### Citations  
- `lookupCitations()` / `useLookupCitationsMutation()`

### Case Law
- `listClusters()` / `useListClustersQuery()` / `useListClustersInfiniteQuery()`
- `getCluster()` / `useGetClusterQuery()`
- `listOpinions()` / `useListOpinionsQuery()` / `useListOpinionsInfiniteQuery()`
- `getOpinion()` / `useGetOpinionQuery()`
- `listDockets()` / `useListDocketsQuery()` / `useListDocketsInfiniteQuery()`
- `getDocket()` / `useGetDocketQuery()`

### Courts
- `listCourts()` / `useListCourtsQuery()` / `useListCourtsInfiniteQuery()`
- `getCourt()` / `useGetCourtQuery()`

### People (Judges)
- `listPeople()` / `useListPeopleQuery()` / `useListPeopleInfiniteQuery()`
- `getPerson()` / `useGetPersonQuery()`

### Audio (Oral Arguments)
- `listAudio()` / `useListAudioQuery()` / `useListAudioInfiniteQuery()`
- `getAudio()` / `useGetAudioQuery()`

## Error Handling

### Standard SDK

```typescript
try {
  const results = await searchDocuments({
    client,
    query: { q: 'invalid query' }
  });
} catch (error) {
  console.error('Search failed:', error);
}
```

### TanStack Query

```tsx
const { data, error, isError } = useSearchDocumentsQuery({
  query: { q: 'constitutional law' }
});

if (isError) {
  console.error('Query failed:', error);
}
```

## TypeScript Support

The SDK is fully typed with TypeScript. All request/response types are automatically generated from the OpenAPI specification:

```typescript
import type { 
  SearchDocumentsResponse,
  SearchDocumentsQueryParams,
  Opinion,
  Cluster 
} from 'courtlistener-sdk';

const handleSearch = async (params: SearchDocumentsQueryParams) => {
  const response: SearchDocumentsResponse = await searchDocuments({
    client,
    query: params
  });
  return response;
};
```

## Rate Limits

CourtListener API has rate limits. The SDK respects these limits:
- Search: General rate limits apply
- Citation Lookup: 60 citations per minute, 250 per request maximum

Handle rate limit errors appropriately in your application.