import { describe, it, expect, beforeAll } from 'bun:test';
import { createApiClient } from '../../src/api';

const SKIP_E2E_TESTS = process.env.SKIP_E2E_TESTS !== 'false';

describe.skipIf(SKIP_E2E_TESTS)('eCFR API E2E Tests', () => {
  let client: ReturnType<typeof createApiClient>;

  beforeAll(() => {
    client = createApiClient({
      baseURL: 'https://www.ecfr.gov',
    });
  });

  describe('Titles Endpoint', () => {
    it('should fetch list of titles', async () => {
      const response = await client.getApiVersionerV1TitlesJson();
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data.titles)).toBe(true);
      expect(response.data.titles.length).toBeGreaterThan(0);
      
      // Check structure of first title
      const firstTitle = response.data.titles[0];
      expect(firstTitle).toHaveProperty('identifier');
      expect(firstTitle).toHaveProperty('name');
    }, 30000);
  });

  describe('Search Endpoint', () => {
    it('should search for regulations', async () => {
      const response = await client.getApiSearchV1Results({
        query: 'safety',
        page: 1,
        per_page: 10,
      });
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data).toHaveProperty('results');
      expect(Array.isArray(response.data.results)).toBe(true);
    }, 30000);
  });
});