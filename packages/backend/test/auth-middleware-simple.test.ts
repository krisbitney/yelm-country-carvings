import { describe, test, expect, spyOn } from 'bun:test';
import { authenticateJWT, authenticateAdmin } from '../src/middleware/auth';
import * as jwtUtils from '../src/utils/jwt';

describe('Authentication Middleware - Simple Tests', () => {
  describe('authenticateJWT', () => {
    test('should return undefined for a valid token', () => {
      // Use spyOn to mock the verifyToken function
      const verifyTokenSpy = spyOn(jwtUtils, 'verifyToken').mockImplementation(() => ({ username: 'admin' }));

      // Create a simple request with Authorization header
      const request = new Request('http://localhost', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      });

      // Call the middleware
      const response = authenticateJWT(request);

      // Verify the response
      expect(response).toBeUndefined();

      // Restore the spy
      verifyTokenSpy.mockRestore();
    });

    test('should return 401 response when no token is provided', () => {
      // Create a simple request without Authorization header
      const request = new Request('http://localhost');

      // Call the middleware
      const response = authenticateJWT(request);

      // Verify the response
      expect(response).toBeDefined();
      expect(response?.status).toBe(401);
    });

    test('should return 401 response for an invalid token', () => {
      // Use spyOn to mock the verifyToken function to return null (invalid token)
      const verifyTokenSpy = spyOn(jwtUtils, 'verifyToken').mockImplementation(() => null);

      // Create a simple request with Authorization header
      const request = new Request('http://localhost', {
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      });

      // Call the middleware
      const response = authenticateJWT(request);

      // Verify the response
      expect(response).toBeDefined();
      expect(response?.status).toBe(401);

      // Restore the spy
      verifyTokenSpy.mockRestore();
    });
  });

  describe('authenticateAdmin', () => {
    test('should return undefined for a valid admin token', () => {
      // Use spyOn to mock the verifyToken function to return a valid payload
      const verifyTokenSpy = spyOn(jwtUtils, 'verifyToken').mockImplementation(() => ({ username: 'admin' }));

      // Create a simple request with Authorization header
      const request = new Request('http://localhost', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      });

      // Call the middleware
      const response = authenticateAdmin(request);

      // Verify the response
      expect(response).toBeUndefined();

      // Restore the spy
      verifyTokenSpy.mockRestore();
    });

    test('should return 401 response when no token is provided', () => {
      // Create a simple request without Authorization header
      const request = new Request('http://localhost');

      // Call the middleware
      const response = authenticateAdmin(request);

      // Verify the response
      expect(response).toBeDefined();
      expect(response?.status).toBe(401);
    });
  });
});
