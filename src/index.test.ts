import { describe, expect, it } from 'bun:test';
import { VERSION } from './index';

describe('ecfr-sdk', () => {
  it('should export VERSION', () => {
    expect(VERSION).toBe('0.1.0');
  });
});
