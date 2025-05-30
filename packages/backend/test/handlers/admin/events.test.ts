import '../../../src/index';
import { describe, test, expect, beforeEach, beforeAll, afterAll } from 'bun:test';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../../../src/handlers/admin/events';
import { closeTestDb, setupTestDb, teardownTestDb } from '../../utils/testDb';
import {
  createTestRequest,
  createTestToken,
  insertTestEvents,
  readTestEvents,
} from '../../utils/helpers';
import { setupTestEventImage } from '../../utils/imageUtils';

describe('Events Handler', () => {
  // Sample event data for testing
  const sampleEvent = {
    title: 'Test Event',
    date: '2023-12-25',
    location: 'Test Location',
    description: 'Test Description',
    image: 'events/test.webp',
    startDate: '2023-12-25',
    endDate: '2023-12-25',
  };
  // Setup valid auth token
  const validToken = createTestToken({ username: 'admin' });
  const validAuthHeader = { Authorization: `Bearer ${validToken}` };

  let testSql: Bun.SQL;

  beforeAll(async () => {
    testSql = await setupTestDb();
  });

  afterAll(async () => {
    await closeTestDb(testSql);
  });

  // Set up test environment before each test
  beforeEach(async () => {
    await teardownTestDb(testSql);
  });

  describe('getEvents', () => {
    test('should return events', async () => {
      // Set up test data
      const testEvents = [{ id: 1, ...sampleEvent }];
      await insertTestEvents(testSql, testEvents);

      // Call the handler
      const response = await getEvents();
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(1);
      expect(data[0].id).toBe(1);
      expect(data[0].title).toBe(sampleEvent.title);
    });

    test('should filter events by year', async () => {
      // Set up test data with different years
      const event2023 = {
        id: 1,
        title: 'Event 2023',
        date: '2023-01-01',
        location: 'Test Location',
        description: 'Test Description',
        image: 'events/test.webp',
        startDate: '2023-01-01',
        endDate: '2023-01-02',
      };

      const event2024 = {
        id: 2,
        title: 'Event 2024',
        date: '2024-01-01',
        location: 'Test Location',
        description: 'Test Description',
        image: 'events/test.webp',
        startDate: '2024-01-01',
        endDate: '2024-01-02',
      };

      await insertTestEvents(testSql, [event2023, event2024]);

      // Create a request with year parameter
      const request = createTestRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/admin/events?year=2024',
      });

      // Call the handler with the request
      const response = await getEvents(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(1);
      expect(data[0].title).toBe('Event 2024');
    });

    test('should handle invalid year parameter', async () => {
      // Create a request with invalid year parameter
      const request = createTestRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/admin/events?year=invalid',
      });

      // Call the handler with the request
      const response = await getEvents(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Invalid year parameter');
    });
  });

  describe('createEvent', () => {
    test('should create a new event', async () => {
      // Create a request with valid auth and event data
      const request = createTestRequest({
        method: 'POST',
        headers: validAuthHeader,
        body: sampleEvent,
      });

      // Call the handler
      const response = await createEvent(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.event).toBeDefined();
      expect(data.event.title).toBe(sampleEvent.title);
      expect(data.event.id).toBeDefined();

      // Verify the event was actually saved to the file
      const savedEvents = await readTestEvents(testSql);
      expect(savedEvents.length).toBe(1);
      expect(savedEvents[0].title).toBe(sampleEvent.title);
      expect(savedEvents[0].id).toBe(data.event.id);
    });
  });

  describe('updateEvent', () => {
    test('should update an existing event', async () => {
      // Setup existing events
      const existingEvents = [{ id: 1, ...sampleEvent }];
      await insertTestEvents(testSql, existingEvents);

      // Create updated event data
      const updatedEvent = {
        ...sampleEvent,
        name: 'Updated Event Name',
      };

      // Create a request with valid auth and updated event data
      const request = createTestRequest({
        method: 'PUT',
        headers: validAuthHeader,
        body: updatedEvent,
      });

      // Call the handler
      const response = await updateEvent(request, 1);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.event).toBeDefined();
      expect(data.event.title).toBe(updatedEvent.title);
      expect(data.event.id).toBe(1);

      // Verify the event was actually updated in the file
      const savedEvents = await readTestEvents(testSql);
      expect(savedEvents.length).toBe(1);
      expect(savedEvents[0].title).toBe(updatedEvent.title);
      expect(savedEvents[0].id).toBe(1);
    });

    test('should return 404 when event does not exist', async () => {
      // Start with empty events
      await testSql`TRUNCATE TABLE events RESTART IDENTITY CASCADE`;

      // Create a request with valid auth and event data
      const request = createTestRequest({
        method: 'PUT',
        headers: validAuthHeader,
        body: sampleEvent,
      });

      // Call the handler
      const response = await updateEvent(request, 999);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);

      // Verify no event was added
      const savedEvents = await readTestEvents(testSql);
      expect(savedEvents.length).toBe(0);
    });
  });

  describe('deleteEvent', () => {
    test('should delete an existing event', async () => {
      // Setup existing events
      const existingEvents = [{ id: 1, ...sampleEvent }];
      await insertTestEvents(testSql, existingEvents);
      await setupTestEventImage('events');

      // Call the handler
      const response = await deleteEvent(1);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      // Verify the event was actually deleted from the file
      const savedEvents = await readTestEvents(testSql);
      expect(savedEvents.length).toBe(0);
    });

    test('should return 404 when event does not exist', async () => {
      // Start with empty events
      await testSql`TRUNCATE TABLE events RESTART IDENTITY CASCADE`;

      // Call the handler
      const response = await deleteEvent(999);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });
  });
});
