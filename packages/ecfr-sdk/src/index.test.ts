import { describe, expect, it } from 'bun:test';
import { VERSION } from './index';

describe('ecfr-sdk', () => {
  it('should export VERSION', () => {
    expect(VERSION).toBeDefined();
    expect(typeof VERSION).toBe('string');
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
