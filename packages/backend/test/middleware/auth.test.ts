import { describe, test, expect, mock } from 'bun:test';
import { authenticateJWT, authenticateAdmin } from '../../src/middleware/auth';
import { createMockRequest, createTestToken } from '../setup';
import '../setup';

describe('Authentication Middleware', () => {
  describe('authenticateJWT', () => {
    test('should return undefined for a valid token', () => {
      const token = createTestToken();
      const request = createMockRequest({
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const response = authenticateJWT(request);
      expect(response).toBeUndefined();
    });

    test('should return 401 response when no token is provided', () => {
      const request = createMockRequest({});
      const response = authenticateJWT(request);

      expect(response).toBeDefined();
      expect(response?.status).toBe(401);
    });

    test('should return 401 response for an invalid token format', () => {
      const request = createMockRequest({
        headers: { 'Authorization': 'InvalidFormat' }
      });

      const response = authenticateJWT(request);
      expect(response).toBeDefined();
      expect(response?.status).toBe(401);
    });

    test('should return 401 response for a malformed token', () => {
      const request = createMockRequest({
        headers: { 'Authorization': 'Bearer invalid.token.here' }
      });

      const response = authenticateJWT(request);
      expect(response).toBeDefined();
      expect(response?.status).toBe(401);
    });
  });

  describe('authenticateAdmin', () => {
    test('should return undefined for a valid admin token', () => {
      const token = createTestToken({ username: 'admin' });
      const request = createMockRequest({
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const response = authenticateAdmin(request);
      expect(response).toBeUndefined();
    });

    test('should return 401 response when no token is provided', () => {
      const request = createMockRequest({});
      const response = authenticateAdmin(request);

      expect(response).toBeDefined();
      expect(response?.status).toBe(401);
    });

    test('should return 401 response for an invalid token', () => {
      const request = createMockRequest({
        headers: { 'Authorization': 'Bearer invalid.token.here' }
      });

      const response = authenticateAdmin(request);
      expect(response).toBeDefined();
      expect(response?.status).toBe(401);
    });
  });
});