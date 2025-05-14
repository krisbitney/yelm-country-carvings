// Import setup first to ensure environment variables are set
import '../../setup';
import "../../../src/index";
import { describe, test, expect, mock, beforeEach, afterEach } from 'bun:test';
import { handleImageUpload } from '../../../src/handlers/admin/upload';
import {createTestRequest, createTestToken} from "../../utils/helpers";
import {cleanupImageDirectories, TEST_IMAGE} from "../../utils/imageUtils";

describe('Image Upload Handler', () => {
  // Setup valid auth token
  const validToken = createTestToken({ username: 'admin' });
  const validAuthHeader = { 'Authorization': `Bearer ${validToken}` };

  beforeEach(async () => {
    // Reset mocks between tests
    mock.restore();
  });

  afterEach(async () => {
    // Clean up image directories after tests
    await cleanupImageDirectories();
  });

  test('should upload an image successfully when authenticated', async () => {
    // Create a mock FormData with file
    const formData = new FormData();

    // Create a mock file
    const file = Bun.file(TEST_IMAGE);
    formData.append('image', file);
    formData.append('type', 'events');

    // Create a mock request with valid auth and form data
    const request = createTestRequest({
      method: 'POST',
      headers: {
        ...validAuthHeader,
        'Content-Type': 'multipart/form-data'
      },
      formData
    });

    // Call the handler
    const response = await handleImageUpload(request);
    const data = await response.json();

    // Verify the response
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.imagePath).toBeDefined();
    expect(data.imagePath).toContain('events/');
    expect(data.imagePath).toContain('.webp');
  });

  test('should return 401 when not authenticated', async () => {
    // Create a mock request without auth
    const request = createTestRequest({
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
    formData.append('type', 'events');

    // Create a mock request with valid auth and form data
    const request = createTestRequest({
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
    const file = new File([fileContent], 'test.webp', { type: 'image/webp' });
    formData.append('image', file);
    formData.append('type', 'invalid');

    // Create a mock request with valid auth and form data
    const request = createTestRequest({
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
});
