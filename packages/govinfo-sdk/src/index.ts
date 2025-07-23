// GovInfo SDK
export * from './api/client';
// Re-export generated types and functions
export * from './api/generated/endpoints';
export type {
  CollectionContainer,
  CollectionSummary,
  GetGranulesForPackageParams,
  GetModifiedCollections1BillVersion,
  GetModifiedCollections1Params,
  GetModifiedCollectionsBillVersion,
  GetModifiedCollectionsParams,
  GetPackagesByDateIssued1BillVersion,
  GetPackagesByDateIssued1Params,
  GetPackagesByDateIssuedBillVersion,
  GetPackagesByDateIssuedParams,
  GranuleContainer,
  GranuleMetadata,
  PackageDetails200,
  PackageInfo,
  RelatedPackageDetails200,
  RelatedVersionsDetails200,
  RelatedVersionsDetailsParams,
  SearchRequest,
  SearchResponse,
  SearchResult,
  SearchResultDownload,
  Sort,
  SortSortOrder,
  SummaryItem,
} from './api/generated/model';
// MCP Server exports
export * from './mcp';

export default {
  name: 'GovInfo SDK',
  version: '0.1.0',
  description: 'TypeScript SDK and MCP server for the GovInfo API',
};
