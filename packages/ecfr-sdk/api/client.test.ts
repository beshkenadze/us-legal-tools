import { describe, expect, it } from 'bun:test';
import { getApiSearchV1Results, getApiVersionerV1TitlesJson } from './generated/endpoints';

describe('API Client', () => {
  describe('Generated functions', () => {
    it('should export search function', () => {
      expect(getApiSearchV1Results).toBeDefined();
      expect(typeof getApiSearchV1Results).toBe('function');
    });

    it('should export titles function', () => {
      expect(getApiVersionerV1TitlesJson).toBeDefined();
      expect(typeof getApiVersionerV1TitlesJson).toBe('function');
    });
  });
});
