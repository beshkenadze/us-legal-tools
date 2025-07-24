import { describe, test, expect, beforeAll } from 'bun:test';
import { getGovInfoAPI } from '../../src/api/generated/endpoints';

describe('GovInfo API E2E Tests', () => {
  let api: ReturnType<typeof getGovInfoAPI>;

  beforeAll(() => {
    // Initialize the API client
    api = getGovInfoAPI();
  });

  describe('Search API', () => {
    test('should search for documents', async () => {
      const response = await api.search({
        query: 'climate',
        pageSize: 5,
        offsetMark: '*', // Required for first page
        historical: false,
        resultLevel: 'default'
      });

      expect(response).toBeDefined();
      expect(response.results).toBeDefined();
      expect(Array.isArray(response.results)).toBe(true);
      expect(response.results.length).toBeGreaterThanOrEqual(0);
    }, 30000); // 30 second timeout

    test('should handle empty search results', async () => {
      const response = await api.search({
        query: 'xyzabc123456789notfound', // Very unlikely to return results
        pageSize: 5,
        offsetMark: '*'
      });

      expect(response).toBeDefined();
      expect(response.results).toBeDefined();
      expect(Array.isArray(response.results)).toBe(true);
    }, 30000);
  });

  describe('Collections API', () => {
    test('should retrieve collection summary', async () => {
      const response = await api.getCollectionSummary();

      expect(response).toBeDefined();
      expect(response.collections).toBeDefined();
      expect(Array.isArray(response.collections)).toBe(true);
      expect(response.collections.length).toBeGreaterThan(0);
      
      const firstCollection = response.collections[0];
      expect(firstCollection.collectionCode).toBeDefined();
      expect(firstCollection.collectionName).toBeDefined();
    }, 30000);
  });

  describe('Package Details API', () => {
    test('should retrieve package details when package exists', async () => {
      // First, get a valid package ID from search results
      const searchResponse = await api.search({
        query: 'federal register',
        pageSize: 1,
        offsetMark: '*'
      });

      expect(searchResponse.results).toBeDefined();
      expect(searchResponse.results.length).toBeGreaterThan(0);

      const packageId = searchResponse.results[0].packageId;
      expect(packageId).toBeDefined();
      
      const details = await api.packageDetails(packageId!);
      
      expect(details).toBeDefined();
      expect(details.packageId).toBe(packageId);
      expect(details.title).toBeDefined();
    }, 30000);

    test('should handle non-existent package gracefully', async () => {
      try {
        await api.packageDetails('INVALID-PACKAGE-ID-12345');
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.response).toBeDefined();
        expect([404, 400]).toContain(error.response.status);
      }
    }, 30000);
  });

  describe('Date-based Package Queries', () => {
    test('should retrieve packages by date issued', async () => {
      const today = new Date();
      const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      const dateString = oneMonthAgo.toISOString().split('T')[0];

      const response = await api.getPackagesByDateIssued(dateString, {
        pageSize: 5
      });

      expect(response).toBeDefined();
      expect(response.packages).toBeDefined();
      expect(Array.isArray(response.packages)).toBe(true);
    }, 30000);
  });
});