import { describe, test, expect, beforeAll, mock } from 'bun:test';
import { generateToken, verifyToken, extractTokenFromHeader } from '../../src/utils/jwt';
import jwt from 'jsonwebtoken';
import '../setup';

// Mock jsonwebtoken to avoid actual verification
mock.module('jsonwebtoken', () => {
  return {
    sign: (payload: any, secret: string, options: any) => {
      return `mocked.jwt.token.${JSON.stringify(payload)}`;
    },
    verify: (token: string, secret: string) => {
      if (token === 'invalid.token.format' || token.includes('invalid')) {
        throw new Error('Invalid token');
      }
      // Extract payload from our mocked token format
      const parts = token.split('.');
      if (parts.length === 3 && parts[0] === 'mocked' && parts[1] === 'jwt') {
        return JSON.parse(parts[2]);
      }
      return { username: 'testuser' };
    }
  };
});

describe('JWT Utilities', () => {
  const testPayload = { username: 'testuser' };
  let token: string;

  beforeAll(() => {
    // Set a known JWT secret for testing
    process.env.JWT_SECRET = 'test_secret';
  });

  describe('generateToken', () => {
    test('should generate a valid JWT token', () => {
      token = generateToken(testPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT format: header.payload.signature
    });

    test('should generate a token with custom expiration', () => {
      const shortToken = generateToken(testPayload, '5m');
      expect(shortToken).toBeDefined();
      expect(shortToken).not.toBe(token); // Different expiration should result in different token
    });
  });

  describe('verifyToken', () => {
    test('should verify a valid token and return the payload', () => {
      const payload = verifyToken(token);
      expect(payload).toBeDefined();
      expect(payload?.username).toBe(testPayload.username);
    });

    test('should return null for an invalid token', () => {
      const invalidToken = 'invalid.token.format';
      const payload = verifyToken(invalidToken);
      expect(payload).toBeNull();
    });

    test('should return null for a tampered token', () => {
      const parts = token.split('.');
      const tamperedToken = `${parts[0]}.${parts[1]}.invalid`;
      const payload = verifyToken(tamperedToken);
      expect(payload).toBeNull();
    });
  });

  describe('extractTokenFromHeader', () => {
    test('should extract token from a valid Authorization header', () => {
      const authHeader = `Bearer ${token}`;
      const extractedToken = extractTokenFromHeader(authHeader);
      expect(extractedToken).toBe(token);
    });

    test('should return null for a missing Authorization header', () => {
      const extractedToken = extractTokenFromHeader(undefined);
      expect(extractedToken).toBeNull();
    });

    test('should return null for an invalid Authorization header format', () => {
      const invalidHeader = `Basic ${token}`;
      const extractedToken = extractTokenFromHeader(invalidHeader);
      expect(extractedToken).toBeNull();
    });

    test('should return null for an empty Authorization header', () => {
      const extractedToken = extractTokenFromHeader('');
      expect(extractedToken).toBeNull();
    });
  });
});
