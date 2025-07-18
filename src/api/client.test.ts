import { describe, expect, it } from 'bun:test';
import INSTANCE from './client';

describe('API Client', () => {
  describe('Axios instance', () => {
    it('should have correct base URL', () => {
      expect(INSTANCE.defaults.baseURL).toBe('https://www.ecfr.gov');
    });

    it('should have correct headers', () => {
      expect(INSTANCE.defaults.headers['User-Agent']).toBe('ecfr-sdk/0.1.0');
      expect(INSTANCE.defaults.headers['Accept']).toBe('application/json');
    });
  });
});