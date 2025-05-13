// Helper to create real requests with test data
import {mock} from "bun:test";
import jwt from "jsonwebtoken";

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
export const createTestToken = (payload = {username: 'admin'}, expiresIn = '1h') => {
  return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn});
};