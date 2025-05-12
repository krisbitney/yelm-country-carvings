import { createTestRequest, createTestToken } from '../../setup';
import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { handleAdminLogin, handleVerifyToken } from '../../../src/handlers/admin/auth';

describe('Auth Handler', () => {
  // Setup valid auth token
  const validToken = createTestToken();
  const validAuthHeader = { 'Authorization': `Bearer ${validToken}` };

  beforeEach(() => {
    // Reset mocks between tests
    mock.restore();
  });

  describe('handleAdminLogin', () => {
    test('should return a token when credentials are valid', async () => {
      // Create a mock request with valid credentials
      const request = createTestRequest({
        method: 'POST',
        body: {
          username: 'admin',
          password: 'secure_password'
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
      const request = createTestRequest({
        method: 'POST',
        body: {
          username: 'invalid',
          password: 'secure_password'
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

      // Create a mock request with valid username but invalid password
      const request = createTestRequest({
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
  });

  describe('handleVerifyToken', () => {
    test('should return success when token is valid', async () => {
      // Create a mock request with valid auth header
      const request = createTestRequest({
        method: 'GET',
        headers: validAuthHeader
      });

      // Call the handler
      const response = handleVerifyToken(request);
      const data = await response.json();

      // Verify the response
      if (response.status !== 200) {
        console.error(JSON.stringify(data, null, 2));
      }
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.username).toBeDefined();
    });

    test('should handle errors during token verification', async () => {
      // Create a mock request with invalid token
      const request = createTestRequest({
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