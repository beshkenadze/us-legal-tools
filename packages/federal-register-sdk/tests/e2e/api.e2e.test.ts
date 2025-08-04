import { describe, it, expect } from 'bun:test';
import { getDocumentsFormat, getAgencies } from '../../src/api/generated/endpoints';

const SKIP_E2E_TESTS = process.env.SKIP_E2E_TESTS !== 'false';

describe.skipIf(SKIP_E2E_TESTS)('Federal Register API E2E Tests', () => {

  describe('Documents Endpoint', () => {
    it('should fetch recent documents', async () => {
      const data = await getDocumentsFormat('json', {
        per_page: 5,
      });
      
      expect(data).toBeDefined();
      expect(data).toHaveProperty('results');
      expect(Array.isArray(data.results)).toBe(true);
      expect(data.count).toBeGreaterThan(0);
    }, 30000);
  });

  describe('Agencies Endpoint', () => {
    it('should fetch list of agencies', async () => {
      const data = await getAgencies();
      
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      
      // Check structure of first agency
      const firstAgency = data[0];
      expect(firstAgency).toHaveProperty('id');
      expect(firstAgency).toHaveProperty('name');
    }, 30000);
  });
});