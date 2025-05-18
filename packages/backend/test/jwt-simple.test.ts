import "../src/index";
import { describe, test, expect } from 'bun:test';
import { extractTokenFromHeader } from '../src/utils/jwt';

describe('JWT Utilities - Simple Tests', () => {
  describe('extractTokenFromHeader', () => {
    test('should extract token from a valid Authorization header', () => {
      const token = 'valid-token';
      const authHeader = `Bearer ${token}`;
      const extractedToken = extractTokenFromHeader(authHeader);
      expect(extractedToken).toBe(token);
    });

    test('should return null for a missing Authorization header', () => {
      const extractedToken = extractTokenFromHeader(undefined);
      expect(extractedToken).toBeNull();
    });

    test('should return null for an invalid Authorization header format', () => {
      const invalidHeader = `Basic token123`;
      const extractedToken = extractTokenFromHeader(invalidHeader);
      expect(extractedToken).toBeNull();
    });

    test('should return null for an empty Authorization header', () => {
      const extractedToken = extractTokenFromHeader('');
      expect(extractedToken).toBeNull();
    });
  });
});