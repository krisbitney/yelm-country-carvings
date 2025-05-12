import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../../src/handlers/admin/events';
import { createMockRequest, createTestToken } from '../../setup';
import '../../setup';

describe('Events Handler', () => {
  // Sample event data for testing
  const sampleEvent = {
    name: 'Test Event',
    date: '2023-12-25',
    location: 'Test Location',
    description: 'Test Description',
    image: 'events/test.webp'
  };

  // Setup valid auth token
  const validToken = createTestToken({ username: 'admin' });
  const validAuthHeader = { 'Authorization': `Bearer ${validToken}` };

  beforeEach(() => {
    // Reset mocks between tests
    mock.restore();
  });

  describe('getEvents', () => {
    test('should return events when authenticated', async () => {
      // Create a mock request with valid auth
      const request = createMockRequest({
        method: 'GET',
        headers: validAuthHeader
      });

      // Call the handler
      const response = await getEvents(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });

    test('should return 401 when not authenticated', async () => {
      // Create a mock request without auth
      const request = createMockRequest({
        method: 'GET'
      });

      // Call the handler
      const response = await getEvents(request);

      // Verify the response
      expect(response.status).toBe(401);
    });
  });

  describe('createEvent', () => {
    test('should create a new event when authenticated', async () => {
      // Create a mock request with valid auth and event data
      const request = createMockRequest({
        method: 'POST',
        headers: validAuthHeader,
        body: sampleEvent
      });

      // Call the handler
      const response = await createEvent(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.event).toBeDefined();
      expect(data.event.name).toBe(sampleEvent.name);
      expect(data.event.id).toBeDefined();
    });

    test('should return 401 when not authenticated', async () => {
      // Create a mock request without auth
      const request = createMockRequest({
        method: 'POST',
        body: sampleEvent
      });

      // Call the handler
      const response = await createEvent(request);

      // Verify the response
      expect(response.status).toBe(401);
    });

    test('should handle errors during event creation', async () => {
      // Create a mock request with valid auth and event data
      const request = createMockRequest({
        method: 'POST',
        headers: validAuthHeader,
        body: sampleEvent
      });

      // Mock fs.writeFile to throw an error
      mock.module('fs/promises', () => ({
        readFile: mock(async () => JSON.stringify([])),
        writeFile: mock(async () => {
          throw new Error('Write error');
        }),
        mkdir: mock(async () => {}),
        unlink: mock(async () => {})
      }));

      // Mock console.error to suppress error logs
      const originalConsoleError = console.error;
      console.error = mock(() => {});

      // Call the handler
      const response = await createEvent(request);
      const data = await response.json();

      // Restore console.error
      console.error = originalConsoleError;

      // Verify the response
      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });
  });

  describe('updateEvent', () => {
    test('should update an existing event when authenticated', async () => {
      // Setup existing events
      const existingEvents = [
        { id: 1, ...sampleEvent }
      ];

      // Mock fs.readFile to return existing events
      mock.module('fs/promises', () => ({
        readFile: mock(async () => JSON.stringify(existingEvents)),
        writeFile: mock(async () => {}),
        mkdir: mock(async () => {}),
        unlink: mock(async () => {})
      }));

      // Create updated event data
      const updatedEvent = {
        ...sampleEvent,
        name: 'Updated Event Name'
      };

      // Create a mock request with valid auth and updated event data
      const request = createMockRequest({
        method: 'PUT',
        headers: validAuthHeader,
        body: updatedEvent
      });

      // Call the handler
      const response = await updateEvent(request, 1);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.event).toBeDefined();
      expect(data.event.name).toBe(updatedEvent.name);
      expect(data.event.id).toBe(1);
    });

    test('should return 404 when event does not exist', async () => {
      // Setup existing events (empty array)
      const existingEvents = [];

      // Mock fs.readFile to return existing events
      mock.module('fs/promises', () => ({
        readFile: mock(async () => JSON.stringify(existingEvents)),
        writeFile: mock(async () => {}),
        mkdir: mock(async () => {}),
        unlink: mock(async () => {})
      }));

      // Create a mock request with valid auth and event data
      const request = createMockRequest({
        method: 'PUT',
        headers: validAuthHeader,
        body: sampleEvent
      });

      // Call the handler
      const response = await updateEvent(request, 999);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });

    test('should return 401 when not authenticated', async () => {
      // Create a mock request without auth
      const request = createMockRequest({
        method: 'PUT',
        body: sampleEvent
      });

      // Call the handler
      const response = await updateEvent(request, 1);

      // Verify the response
      expect(response.status).toBe(401);
    });
  });

  describe('deleteEvent', () => {
    test('should delete an existing event when authenticated', async () => {
      // Setup existing events
      const existingEvents = [
        { id: 1, ...sampleEvent }
      ];

      // Mock fs.readFile to return existing events
      mock.module('fs/promises', () => ({
        readFile: mock(async () => JSON.stringify(existingEvents)),
        writeFile: mock(async () => {}),
        mkdir: mock(async () => {}),
        unlink: mock(async () => {})
      }));

      // Create a mock request with valid auth
      const request = createMockRequest({
        method: 'DELETE',
        headers: validAuthHeader
      });

      // Call the handler
      const response = await deleteEvent(request, 1);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    test('should return 404 when event does not exist', async () => {
      // Setup existing events (empty array)
      const existingEvents = [];

      // Mock fs.readFile to return existing events
      mock.module('fs/promises', () => ({
        readFile: mock(async () => JSON.stringify(existingEvents)),
        writeFile: mock(async () => {}),
        mkdir: mock(async () => {}),
        unlink: mock(async () => {})
      }));

      // Create a mock request with valid auth
      const request = createMockRequest({
        method: 'DELETE',
        headers: validAuthHeader
      });

      // Call the handler
      const response = await deleteEvent(request, 999);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });

    test('should return 401 when not authenticated', async () => {
      // Create a mock request without auth
      const request = createMockRequest({
        method: 'DELETE'
      });

      // Call the handler
      const response = await deleteEvent(request, 1);

      // Verify the response
      expect(response.status).toBe(401);
    });
  });
});