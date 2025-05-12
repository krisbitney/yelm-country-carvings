import { beforeEach, mock } from 'bun:test';
import dotenv from 'dotenv';

dotenv.config();

// Mock fs/promises
const mockData = {
  events: [],
  gallery: []
};

const mockFs = {
  readFile: mock(async (filePath: string) => {
    if (filePath.includes('events.json')) {
      return JSON.stringify(mockData.events);
    }
    if (filePath.includes('gallery.json')) {
      return JSON.stringify(mockData.gallery);
    }
    throw new Error(`File not found: ${filePath}`);
  }),
  writeFile: mock(async (filePath: string, data: string) => {
    if (filePath.includes('events.json')) {
      mockData.events = JSON.parse(data);
      return;
    }
    if (filePath.includes('gallery.json')) {
      mockData.gallery = JSON.parse(data);
      return;
    }
    throw new Error(`File not found: ${filePath}`);
  }),
  mkdir: mock(async () => {}),
  unlink: mock(async () => {})
};

// Apply the mock
mock.module('fs', () => mockFs);

// Mock jsonwebtoken to avoid actual verification
mock.module('jsonwebtoken', () => {
  return {
    sign: (payload: any, secret: string, options: any) => {
      return `mocked.jwt.token.${JSON.stringify(payload)}`;
    },
    verify: (token: string, secret: string) => {
      if (token === 'invalid.token.format' || token.includes('invalid')) {
        throw new Error('Invalid token');
      }
      // Extract payload from our mocked token format
      const parts = token.split('.');
      if (parts.length === 3 && parts[0] === 'mocked' && parts[1] === 'jwt') {
        return JSON.parse(parts[2]);
      }
      return { username: 'testuser' };
    }
  };
});

// Mock SMTP2GO
mock.module('smtp2go-nodejs', () => {
  const mockMailService = {
    from: mock(() => mockMailService),
    to: mock(() => mockMailService),
    subject: mock(() => mockMailService),
    html: mock(() => mockMailService),
    attach: mock(() => mockMailService)
  };

  const mockClient = {
    consume: mock(async () => ({ success: true }))
  };

  return mock(() => ({
    mail: mock(() => mockMailService),
    client: mock(() => mockClient)
  }));
});

// Helper to create mock requests
export const createMockRequest = (options: {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  body?: any;
  formData?: FormData;
}) => {
  const {
    method = 'GET',
    url = 'http://localhost:3000',
    headers = {},
    body = null,
    formData = null
  } = options;

  const request = new Request(url, {
    method,
    headers: new Headers(headers)
  });

  // Add mock methods for JSON and formData
  if (body) {
    request.json = mock(async () => body);
  }

  if (formData) {
    request.formData = mock(async () => formData);
  }

  return request;
};

// Helper to create a valid JWT token for testing
export const createTestToken = (payload = { username: 'admin' }) => {
  // Use our mocked format directly to ensure consistency
  return `mocked.jwt.token.${JSON.stringify(payload)}`;
};

// Reset mocks between tests
beforeEach(() => {
  mock.restore();
});
