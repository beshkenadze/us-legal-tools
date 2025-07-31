import { describe, it, expect, beforeAll } from 'bun:test';
import { getDocumentsFormat, getAgencies } from '../../src/api/generated/endpoints';
import { customInstance } from '../../src/api/client';

const SKIP_E2E_TESTS = process.env.SKIP_E2E_TESTS !== 'false';

describe.skipIf(SKIP_E2E_TESTS)('Federal Register API E2E Tests', () => {
  beforeAll(() => {
    // Configure the base URL for the custom instance
    customInstance.defaults.baseURL = 'https://www.federalregister.gov/api/v1';
  });

  describe('Documents Endpoint', () => {
    it('should fetch recent documents', async () => {
      const response = await getDocumentsFormat('json', {
        per_page: 5,
      });
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data.results)).toBe(true);
      expect(response.data.count).toBeGreaterThan(0);
    }, 30000);
  });

  describe('Agencies Endpoint', () => {
    it('should fetch list of agencies', async () => {
      const response = await getAgencies();
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
      
      // Check structure of first agency
      const firstAgency = response.data[0];
      expect(firstAgency).toHaveProperty('id');
      expect(firstAgency).toHaveProperty('name');
    }, 30000);
  });
});