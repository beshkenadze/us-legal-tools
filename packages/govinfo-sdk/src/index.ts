// GovInfo SDK
export * from './api/client';
// Re-export generated functions and types
export * from './api/generated/endpoints';
// Re-export additional types from model (SearchResult will come from endpoints)
export type {
  CollectionContainer,
  CollectionSummary,
  GranuleContainer,
  GranuleMetadata,
  PackageInfo,
  SearchRequest,
  SearchResponse,
  SearchResultDownload,
  Sort,
  SortSortOrder,
  SummaryItem
} from './api/generated/model';

export default {
  name: 'GovInfo SDK',
  version: '0.1.0',
  description: 'TypeScript SDK and MCP server for the GovInfo API',
};
