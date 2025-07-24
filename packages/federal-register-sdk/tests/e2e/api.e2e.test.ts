import { describe, it, expect, beforeAll } from 'bun:test';
import { createApiClient } from '../../src/api';

const SKIP_E2E_TESTS = process.env.SKIP_E2E_TESTS !== 'false';

describe.skipIf(SKIP_E2E_TESTS)('Federal Register API E2E Tests', () => {
  let client: ReturnType<typeof createApiClient>;

  beforeAll(() => {
    client = createApiClient({
      baseURL: 'https://www.federalregister.gov',
    });
  });

  describe('Documents Endpoint', () => {
    it('should fetch recent documents', async () => {
      const response = await client.getApiV1Documents({
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
      const response = await client.getApiV1Agencies();
      
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