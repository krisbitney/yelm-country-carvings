// Helper to create real requests with test data
import { mock } from 'bun:test';
import jwt from 'jsonwebtoken';
import { SQL } from 'bun';
import { GalleryImage, MarketEvent } from '../../src/types';

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
    formData = null,
  } = options;

  // Create request options
  const requestOptions: RequestInit = {
    method,
    headers: new Headers(headers),
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
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// Helper function to insert test events into the database
export const insertTestEvents = async (testSql: SQL, events: MarketEvent[]) => {
  for (const event of events) {
    await testSql`
        INSERT INTO events (
          id, 
          title, 
          date, 
          location, 
          description, 
          image, 
          start_date, 
          end_date
        ) 
        VALUES (
          ${event.id}, 
          ${event.title}, 
          ${event.date}, 
          ${event.location}, 
          ${event.description}, 
          ${event.image}, 
          ${event.startDate || null}, 
          ${event.endDate || null}
        )
      `;
  }
};

// Helper function to read test events from the database
export const readTestEvents = async (testSql: SQL): Promise<MarketEvent[]> => {
  return await testSql`
      SELECT 
        id, 
        title, 
        date, 
        location, 
        description, 
        image, 
        start_date as "startDate", 
        end_date as "endDate" 
      FROM events 
      ORDER BY id
    `;
};

// Helper function to insert test gallery images into the database
export const insertTestGallery = async (testSql: SQL, gallery: GalleryImage[]) => {
  for (const image of gallery) {
    await testSql`
        INSERT INTO gallery (
          id, 
          src, 
          alt, 
          order_position
        ) 
        VALUES (
          ${image.id}, 
          ${image.src}, 
          ${image.alt}, 
          ${image.order}
        )
      `;
  }
};

// Helper function to read test gallery from the database
export const readTestGallery = async (testSql: SQL): Promise<GalleryImage[]> => {
  return await testSql`
      SELECT 
        id, 
        src, 
        alt, 
        order_position as "order" 
      FROM gallery 
      ORDER BY order_position
    `;
};
