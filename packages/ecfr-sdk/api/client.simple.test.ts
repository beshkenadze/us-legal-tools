import { describe, expect, it } from 'bun:test';
import { 
  getApiAdminV1AgenciesJson,
  getApiAdminV1CorrectionsJson,
  getApiAdminV1CorrectionsTitleTitleJson,
  getApiSearchV1Results,
  getApiVersionerV1TitlesJson,
  getApiVersionerV1StructureDateTitleTitleJson,
  getApiVersionerV1VersionsTitleTitleJson
} from './generated/endpoints';

describe('eCFR SDK - Simple Tests', () => {
  describe('Generated Functions', () => {
    it('should export all API functions', () => {
      expect(getApiAdminV1AgenciesJson).toBeDefined();
      expect(typeof getApiAdminV1AgenciesJson).toBe('function');
      
      expect(getApiSearchV1Results).toBeDefined();
      expect(typeof getApiSearchV1Results).toBe('function');
      
      expect(getApiVersionerV1TitlesJson).toBeDefined();
      expect(typeof getApiVersionerV1TitlesJson).toBe('function');
      
      expect(getApiVersionerV1StructureDateTitleTitleJson).toBeDefined();
      expect(typeof getApiVersionerV1StructureDateTitleTitleJson).toBe('function');
    });
  });

  describe('Parameter Validation', () => {
    it('should handle search parameters correctly', () => {
      // These should not throw errors when called
      expect(() => {
        getApiSearchV1Results({
          query: 'test',
          page: 1,
          per_page: 10,
        });
      }).not.toThrow();
    });

    it('should handle versioner parameters correctly', () => {
      // These should not throw errors when called
      expect(() => {
        getApiVersionerV1StructureDateTitleTitleJson('2024-01-01', '29');
      }).not.toThrow();

      expect(() => {
        getApiVersionerV1VersionsTitleTitleJson('29', {
          'issue_date[on]': '2024-01-01',
        });
      }).not.toThrow();
    });

    it('should handle admin parameters correctly', () => {
      // These should not throw errors when called
      expect(() => {
        getApiAdminV1CorrectionsJson({
          title: '29',
          date: '2024-01-01',
        });
      }).not.toThrow();

      expect(() => {
        getApiAdminV1CorrectionsTitleTitleJson('29');
      }).not.toThrow();
    });
  });

  describe('Type Safety', () => {
    it('should enforce parameter types at compile time', () => {
      // These would cause TypeScript errors if types are wrong
      const searchParams = {
        query: 'test',
        page: 1, // Should be number, not string
        per_page: 10, // Should be number, not string
      };

      expect(() => {
        getApiSearchV1Results(searchParams);
      }).not.toThrow();
    });
  });
});
