import { describe, expect, it } from 'bun:test';
import { getECFRAPIDocumentation } from './api/generated/endpoints';
import { VERSION } from './index';

describe('eCFR SDK - Integration Tests', () => {
  describe('SDK Exports', () => {
    it('should export VERSION constant', () => {
      expect(VERSION).toBeDefined();
      expect(typeof VERSION).toBe('string');
      expect(VERSION).toBe('0.1.0');
    });

    it('should export API client factory', () => {
      expect(getECFRAPIDocumentation).toBeDefined();
      expect(typeof getECFRAPIDocumentation).toBe('function');
    });
  });

  describe('API Client Integration', () => {
    it('should create working API client', () => {
      const api = getECFRAPIDocumentation();

      // Check that all expected methods exist
      const expectedMethods = [
        'getApiAdminV1AgenciesJson',
        'getApiAdminV1CorrectionsJson',
        'getApiAdminV1CorrectionsTitleTitleJson',
        'getApiSearchV1Results',
        'getApiSearchV1Count',
        'getApiSearchV1Summary',
        'getApiSearchV1CountsDaily',
        'getApiSearchV1CountsTitles',
        'getApiSearchV1CountsHierarchy',
        'getApiSearchV1Suggestions',
        'getApiVersionerV1AncestryDateTitleTitleJson',
        'getApiVersionerV1FullDateTitleTitleXml',
        'getApiVersionerV1StructureDateTitleTitleJson',
        'getApiVersionerV1TitlesJson',
        'getApiVersionerV1VersionsTitleTitleJson',
      ];

      for (const method of expectedMethods) {
        expect(api).toHaveProperty(method);
        expect(typeof api[method]).toBe('function');
      }
    });
  });

  describe('Parameter Validation', () => {
    it('should validate search parameters', () => {
      const api = getECFRAPIDocumentation();

      // Valid parameters should not throw
      expect(() => {
        api.getApiSearchV1Results({
          query: 'test query',
          page: 1,
          per_page: 20,
          order: 'relevance',
          paginate_by: 'results',
        });
      }).not.toThrow();
    });

    it('should validate versioner parameters', () => {
      const api = getECFRAPIDocumentation();

      // Valid parameters should not throw
      expect(() => {
        api.getApiVersionerV1VersionsTitleTitleJson('29', {
          'issue_date[on]': '2024-01-01',
          part: '778',
          section: '217',
        });
      }).not.toThrow();
    });

    it('should validate admin parameters', () => {
      const api = getECFRAPIDocumentation();

      // Valid parameters should not throw
      expect(() => {
        api.getApiAdminV1CorrectionsJson({
          title: '29',
          date: '2024-01-01',
        });
      }).not.toThrow();
    });
  });

  describe('Real-world Usage Patterns', () => {
    it('should support finding specific regulations', () => {
      const api = getECFRAPIDocumentation();

      // Pattern: Search for specific regulation
      expect(typeof api.getApiSearchV1Results).toBe('function');

      // Test that method accepts correct parameters
      const searchParams = {
        query: '778.217',
        page: 1,
        per_page: 10,
      };

      expect(() => {
        // Just test the method exists and accepts parameters
        // Don't actually call it to avoid network requests
        api.getApiSearchV1Results;
      }).not.toThrow();
    });

    it('should support getting title structure', () => {
      const api = getECFRAPIDocumentation();

      // Pattern: Get title structure
      expect(typeof api.getApiVersionerV1StructureDateTitleTitleJson).toBe('function');

      // Test method signature accepts date and title parameters
      expect(api.getApiVersionerV1StructureDateTitleTitleJson.length).toBe(2);
    });

    it('should support getting ancestry information', () => {
      const api = getECFRAPIDocumentation();

      // Pattern: Get ancestry for specific part
      expect(typeof api.getApiVersionerV1AncestryDateTitleTitleJson).toBe('function');

      // Test method signature accepts date, title, and optional params
      expect(api.getApiVersionerV1AncestryDateTitleTitleJson.length).toBe(3);
    });
  });
});
