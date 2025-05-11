import { describe, test, expect, mock } from 'bun:test';
import { authenticateJWT, authenticateAdmin } from '../src/middleware/auth';
import * as jwtUtils from '../src/utils/jwt';

describe('Authentication Middleware - Simple Tests', () => {
  describe('authenticateJWT', () => {
    test('should return undefined for a valid token', () => {
      // Mock the verifyToken function to return a valid payload
      const originalVerifyToken = jwtUtils.verifyToken;
      jwtUtils.verifyToken = mock(() => ({ username: 'admin' }));
      
      // Create a simple request with Authorization header
      const request = new Request('http://localhost', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      });
      
      // Call the middleware
      const response = authenticateJWT(request);
      
      // Restore the original function
      jwtUtils.verifyToken = originalVerifyToken;
      
      // Verify the response
      expect(response).toBeUndefined();
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
      // Mock the verifyToken function to return null (invalid token)
      const originalVerifyToken = jwtUtils.verifyToken;
      jwtUtils.verifyToken = mock(() => null);
      
      // Create a simple request with Authorization header
      const request = new Request('http://localhost', {
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      });
      
      // Call the middleware
      const response = authenticateJWT(request);
      
      // Restore the original function
      jwtUtils.verifyToken = originalVerifyToken;
      
      // Verify the response
      expect(response).toBeDefined();
      expect(response?.status).toBe(401);
    });
  });
  
  describe('authenticateAdmin', () => {
    test('should return undefined for a valid admin token', () => {
      // Mock the verifyToken function to return a valid payload
      const originalVerifyToken = jwtUtils.verifyToken;
      jwtUtils.verifyToken = mock(() => ({ username: 'admin' }));
      
      // Create a simple request with Authorization header
      const request = new Request('http://localhost', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      });
      
      // Call the middleware
      const response = authenticateAdmin(request);
      
      // Restore the original function
      jwtUtils.verifyToken = originalVerifyToken;
      
      // Verify the response
      expect(response).toBeUndefined();
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