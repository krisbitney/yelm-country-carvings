import { beforeEach, afterEach, mock } from 'bun:test';
import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';

// Set up test-specific environment
export const TEST_DATA_DIR = path.join(__dirname, 'test-data');
export const TEST_EVENTS_FILE = path.join(TEST_DATA_DIR, 'events.json');
export const TEST_GALLERY_FILE = path.join(TEST_DATA_DIR, 'gallery.json');
export const TEST_IMAGE = path.join(TEST_DATA_DIR, "test-image.webp");
export const TEST_JWT_SECRET = 'test-secret';

// Set environment variables for test mode
process.env.NODE_ENV = 'test';
process.env.TEST_EVENTS_FILE = TEST_EVENTS_FILE;
process.env.TEST_GALLERY_FILE = TEST_GALLERY_FILE;
// Set environment variables for testing
process.env.ADMIN_USERNAME = 'admin';
process.env.ADMIN_PASSWORD = 'secure_password';
// Patch the JWT verification to use our test secret
// Set this early to ensure it's available before any imports
process.env.JWT_SECRET = TEST_JWT_SECRET;

// Create test data directory and files if they don't exist
beforeEach(async () => {
  try {
    await fs.mkdir(TEST_DATA_DIR, { recursive: true });

    // Initialize empty events and gallery files
    await fs.writeFile(TEST_EVENTS_FILE, JSON.stringify([]));
    await fs.writeFile(TEST_GALLERY_FILE, JSON.stringify([]));
  } catch (error) {
    console.error('Error setting up test environment:', error);
  }
});

// Clean up test data after each test
afterEach(async () => {
  try {
    // Clean up test files but keep the directory
    await fs.writeFile(TEST_EVENTS_FILE, JSON.stringify([]));
    await fs.writeFile(TEST_GALLERY_FILE, JSON.stringify([]));
  } catch (error) {
    console.error('Error cleaning up test environment:', error);
  }
});

// Helper to create real requests with test data
export const createTestRequest = (options: {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  body?: unknown;
  formData?: FormData;
}) => {
  const {
    method = 'GET',
    url = 'http://localhost:3000',
    headers = {},
    body = null,
    formData = null
  } = options;

  // Create request options
  const requestOptions: RequestInit = {
    method,
    headers: new Headers(headers)
  };

  // Add body if provided
  if (body) {
    requestOptions.body = JSON.stringify(body);
    if (!requestOptions.headers['Content-Type']) {
      requestOptions.headers['Content-Type'] = 'application/json';
    }
  }

  // Create the request
  const request = new Request(url, requestOptions);

  // For tests that need to mock formData
  if (formData) {
    request.formData = mock(async () => formData);
  }

  return request;
};

// Helper to create a valid JWT token for testing
export const createTestToken = (payload = { username: 'admin' }, expiresIn = '1h') => {
  return jwt.sign(payload, TEST_JWT_SECRET, { expiresIn });
};

