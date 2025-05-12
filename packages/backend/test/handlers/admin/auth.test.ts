import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { handleAdminLogin, handleVerifyToken } from '../../../src/handlers/admin/auth';
import { createMockRequest, createTestToken } from '../../setup';
import bcrypt from 'bcrypt';
import '../../setup';

describe('Auth Handler', () => {
  // Setup valid auth token
  const validToken = createTestToken({ username: 'admin' });
  const validAuthHeader = { 'Authorization': `Bearer ${validToken}` };

  beforeEach(() => {
    // Reset mocks between tests
    mock.restore();
    
    // Set environment variables for testing
    process.env.ADMIN_USERNAME = 'admin';
    process.env.ADMIN_PASSWORD_HASH = 'hashed_password';
  });

  describe('handleAdminLogin', () => {
    test('should return a token when credentials are valid', async () => {
      // Mock bcrypt.compare to return true (valid password)
      mock.module('bcrypt', () => ({
        compare: mock(async () => true)
      }));

      // Create a mock request with valid credentials
      const request = createMockRequest({
        method: 'POST',
        body: {
          username: 'admin',
          password: 'password123'
        }
      });

      // Call the handler
      const response = await handleAdminLogin(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.token).toBeDefined();
    });

    test('should return 401 when username is invalid', async () => {
      // Create a mock request with invalid username
      const request = createMockRequest({
        method: 'POST',
        body: {
          username: 'invalid',
          password: 'password123'
        }
      });

      // Call the handler
      const response = await handleAdminLogin(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });

    test('should return 401 when password is invalid', async () => {
      // Mock bcrypt.compare to return false (invalid password)
      mock.module('bcrypt', () => ({
        compare: mock(async () => false)
      }));

      // Create a mock request with valid username but invalid password
      const request = createMockRequest({
        method: 'POST',
        body: {
          username: 'admin',
          password: 'wrongpassword'
        }
      });

      // Call the handler
      const response = await handleAdminLogin(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });

    test('should handle errors during login', async () => {
      // Mock bcrypt.compare to throw an error
      mock.module('bcrypt', () => ({
        compare: mock(async () => {
          throw new Error('Bcrypt error');
        })
      }));

      // Create a mock request with valid credentials
      const request = createMockRequest({
        method: 'POST',
        body: {
          username: 'admin',
          password: 'password123'
        }
      });

      // Mock console.error to suppress error logs
      const originalConsoleError = console.error;
      console.error = mock(() => {});

      // Call the handler
      const response = await handleAdminLogin(request);
      const data = await response.json();

      // Restore console.error
      console.error = originalConsoleError;

      // Verify the response
      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });
  });

  describe('handleVerifyToken', () => {
    test('should return success when token is valid', async () => {
      // Create a mock request with valid auth header
      const request = createMockRequest({
        method: 'GET',
        headers: validAuthHeader
      });

      // Call the handler
      const response = await handleVerifyToken(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.username).toBeDefined();
    });

    test('should handle errors during token verification', async () => {
      // Create a mock request with invalid token
      const request = createMockRequest({
        method: 'GET',
        headers: { 'Authorization': 'Bearer invalid.token.here' }
      });

      // Call the handler
      const response = await handleVerifyToken(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });
  });
});