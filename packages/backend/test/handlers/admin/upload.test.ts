import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { handleImageUpload } from '../../../src/handlers/admin/upload';
import { createMockRequest, createTestToken } from '../../setup';
import path from 'path';
import '../../setup';

describe('Image Upload Handler', () => {
  // Setup valid auth token
  const validToken = createTestToken({ username: 'admin' });
  const validAuthHeader = { 'Authorization': `Bearer ${validToken}` };

  beforeEach(() => {
    // Reset mocks between tests
    mock.restore();
  });

  test('should upload an image successfully when authenticated', async () => {
    // Create a mock FormData with file
    const formData = new FormData();
    
    // Create a mock file
    const fileContent = 'test file content';
    const file = new File([fileContent], 'test.jpg', { type: 'image/jpeg' });
    formData.append('image', file);
    formData.append('folder', 'events');
    
    // Create a mock request with valid auth and form data
    const request = createMockRequest({
      method: 'POST',
      headers: validAuthHeader,
      formData
    });
    
    // Mock the formData method to return our form data
    request.formData = mock(async () => formData);
    
    // Mock sharp for image processing
    mock.module('sharp', () => {
      return mock(() => ({
        webp: mock(() => ({
          toFile: mock(async (filePath) => {
            return { path: filePath };
          })
        }))
      }));
    });
    
    // Mock fs.mkdir to ensure directory exists
    mock.module('fs/promises', () => ({
      mkdir: mock(async () => {}),
      writeFile: mock(async () => {}),
      readFile: mock(async () => '[]'),
      unlink: mock(async () => {})
    }));
    
    // Call the handler
    const response = await handleImageUpload(request);
    const data = await response.json();
    
    // Verify the response
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.path).toBeDefined();
    expect(data.path).toContain('events/');
    expect(data.path).toContain('.webp');
  });

  test('should return 401 when not authenticated', async () => {
    // Create a mock request without auth
    const request = createMockRequest({
      method: 'POST'
    });
    
    // Call the handler
    const response = await handleImageUpload(request);
    
    // Verify the response
    expect(response.status).toBe(401);
  });

  test('should return 400 when no file is provided', async () => {
    // Create a mock FormData without file
    const formData = new FormData();
    formData.append('folder', 'events');
    
    // Create a mock request with valid auth and form data
    const request = createMockRequest({
      method: 'POST',
      headers: validAuthHeader,
      formData
    });
    
    // Mock the formData method to return our form data
    request.formData = mock(async () => formData);
    
    // Call the handler
    const response = await handleImageUpload(request);
    const data = await response.json();
    
    // Verify the response
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  test('should return 400 when folder is invalid', async () => {
    // Create a mock FormData with file but invalid folder
    const formData = new FormData();
    
    // Create a mock file
    const fileContent = 'test file content';
    const file = new File([fileContent], 'test.jpg', { type: 'image/jpeg' });
    formData.append('image', file);
    formData.append('folder', 'invalid');
    
    // Create a mock request with valid auth and form data
    const request = createMockRequest({
      method: 'POST',
      headers: validAuthHeader,
      formData
    });
    
    // Mock the formData method to return our form data
    request.formData = mock(async () => formData);
    
    // Call the handler
    const response = await handleImageUpload(request);
    const data = await response.json();
    
    // Verify the response
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  test('should handle errors during image processing', async () => {
    // Create a mock FormData with file
    const formData = new FormData();
    
    // Create a mock file
    const fileContent = 'test file content';
    const file = new File([fileContent], 'test.jpg', { type: 'image/jpeg' });
    formData.append('image', file);
    formData.append('folder', 'events');
    
    // Create a mock request with valid auth and form data
    const request = createMockRequest({
      method: 'POST',
      headers: validAuthHeader,
      formData
    });
    
    // Mock the formData method to return our form data
    request.formData = mock(async () => formData);
    
    // Mock sharp to throw an error
    mock.module('sharp', () => {
      return mock(() => {
        throw new Error('Image processing error');
      });
    });
    
    // Mock console.error to suppress error logs
    const originalConsoleError = console.error;
    console.error = mock(() => {});
    
    // Call the handler
    const response = await handleImageUpload(request);
    const data = await response.json();
    
    // Restore console.error
    console.error = originalConsoleError;
    
    // Verify the response
    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
  });
});