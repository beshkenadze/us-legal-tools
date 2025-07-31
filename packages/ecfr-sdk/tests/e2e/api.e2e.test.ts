import { describe, it, expect } from 'bun:test';
import { getApiVersionerV1TitlesJson, getApiSearchV1Results } from '../../src/api/generated/endpoints';
import type { GetApiSearchV1ResultsParams } from '../../src/api/generated/models';

const SKIP_E2E_TESTS = process.env.SKIP_E2E_TESTS !== 'false';

describe.skipIf(SKIP_E2E_TESTS)('eCFR API E2E Tests', () => {

  describe('Titles Endpoint', () => {
    it('should fetch list of titles', async () => {
      const response = await getApiVersionerV1TitlesJson();
      
      expect(response).toBeDefined();
      expect(Array.isArray(response.titles)).toBe(true);
      expect(response.titles.length).toBeGreaterThan(0);
      
      // Check structure of first title
      if (response.titles.length > 0) {
        const firstTitle = response.titles[0];
        // Title objects should have some properties
        expect(typeof firstTitle).toBe('object');
        expect(firstTitle).toBeTruthy();
      }
    }, 30000);
  });

  describe('Search Endpoint', () => {
    it('should search for regulations', async () => {
      const params: GetApiSearchV1ResultsParams = {
        query: 'safety',
        page: 1,
        per_page: 10,
      };
      
      const response = await getApiSearchV1Results(params);
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('results');
      expect(Array.isArray(response.results)).toBe(true);
    }, 30000);
  });
});