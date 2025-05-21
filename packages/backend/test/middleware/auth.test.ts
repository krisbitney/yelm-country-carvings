import '../../src/index';
import { describe, test, expect } from 'bun:test';
import { authenticateJWT } from '../../src/middleware/auth';
import { generateToken } from '../../src/utils/jwt';
import { createTestRequest } from '../utils/helpers';

describe('Authentication Middleware', () => {
  describe('authenticateJWT', () => {
    test('should return undefined for a valid token', () => {
      const token = generateToken({ username: 'testuser' });
      const request = createTestRequest({
        headers: { Authorization: `Bearer ${token}` },
      });

      const response = authenticateJWT(request);
      expect(response).toBeUndefined();
    });

    test('should return 401 response when no token is provided', () => {
      const request = createTestRequest({});
      const response = authenticateJWT(request);

      expect(response).toBeDefined();
      expect(response?.status).toBe(401);
    });

    test('should return 401 response for an invalid token format', () => {
      const request = createTestRequest({
        headers: { Authorization: 'InvalidFormat' },
      });

      const response = authenticateJWT(request);
      expect(response).toBeDefined();
      expect(response?.status).toBe(401);
    });

    test('should return 401 response for a malformed token', () => {
      const request = createTestRequest({
        headers: { Authorization: 'Bearer invalid.token.here' },
      });

      const response = authenticateJWT(request);
      expect(response).toBeDefined();
      expect(response?.status).toBe(401);
    });
  });

  describe('authenticateAdmin', () => {
    test('should return undefined for a valid admin token', () => {
      const token = generateToken({ username: 'admin' });
      const request = createTestRequest({
        headers: { Authorization: `Bearer ${token}` },
      });

      const response = authenticateJWT(request);
      expect(response).toBeUndefined();
    });

    test('should return 401 response when no token is provided', () => {
      const request = createTestRequest({});
      const response = authenticateJWT(request);

      expect(response).toBeDefined();
      expect(response?.status).toBe(401);
    });

    test('should return 401 response for an invalid token', () => {
      const request = createTestRequest({
        headers: { Authorization: 'Bearer invalid.token.here' },
      });

      const response = authenticateJWT(request);
      expect(response).toBeDefined();
      expect(response?.status).toBe(401);
    });
  });
});
