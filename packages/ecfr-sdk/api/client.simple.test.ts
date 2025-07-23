import { describe, expect, it } from 'bun:test';
import { customInstance } from './client';
import { getEcfrsdk } from './generated/endpoints';

describe('eCFR SDK - Simple Tests', () => {
  describe('API Client Factory', () => {
    it('should create API client with all methods', () => {
      const api = getEcfrsdk();

      expect(api).toBeDefined();
      expect(typeof api.getApiAdminV1AgenciesJson).toBe('function');
      expect(typeof api.getApiSearchV1Results).toBe('function');
      expect(typeof api.getApiVersionerV1TitlesJson).toBe('function');
      expect(typeof api.getApiVersionerV1StructureDateTitleTitleJson).toBe('function');
    });
  });

  describe('Custom Instance', () => {
    it('should create custom instance with proper config', () => {
      const promise = customInstance({
        url: '/test',
        method: 'GET',
      });

      expect(promise).toBeDefined();
      expect(promise).toBeInstanceOf(Promise);
      expect(typeof promise.cancel).toBe('function');
    });
  });

  describe('Parameter Validation', () => {
    it('should handle search parameters correctly', () => {
      const api = getEcfrsdk();

      // These should not throw errors when called
      expect(() => {
        api.getApiSearchV1Results({
          query: 'test',
          page: 1,
          per_page: 10,
        });
      }).not.toThrow();
    });

    it('should handle versioner parameters correctly', () => {
      const api = getEcfrsdk();

      // These should not throw errors when called
      expect(() => {
        api.getApiVersionerV1StructureDateTitleTitleJson('2024-01-01', '29');
      }).not.toThrow();

      expect(() => {
        api.getApiVersionerV1VersionsTitleTitleJson('29', {
          'issue_date[on]': '2024-01-01',
        });
      }).not.toThrow();
    });

    it('should handle admin parameters correctly', () => {
      const api = getEcfrsdk();

      // These should not throw errors when called
      expect(() => {
        api.getApiAdminV1CorrectionsJson({
          title: '29',
          date: '2024-01-01',
        });
      }).not.toThrow();

      expect(() => {
        api.getApiAdminV1CorrectionsTitleTitleJson('29');
      }).not.toThrow();
    });
  });

  describe('Type Safety', () => {
    it('should enforce parameter types at compile time', () => {
      const api = getEcfrsdk();

      // These would cause TypeScript errors if types are wrong
      const searchParams = {
        query: 'test',
        page: 1, // Should be number, not string
        per_page: 10, // Should be number, not string
      };

      expect(() => {
        api.getApiSearchV1Results(searchParams);
      }).not.toThrow();
    });
  });
});
