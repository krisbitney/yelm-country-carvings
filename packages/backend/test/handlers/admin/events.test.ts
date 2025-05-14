// Import setup first to ensure environment variables are set
import '../../setup';
import "../../../src/index";
import {describe, test, expect, beforeEach, beforeAll, afterAll} from 'bun:test';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../../src/handlers/admin/events';
import {closeTestDb, setupTestDb, teardownTestDb} from "../../utils/testDb";
import {createTestRequest, createTestToken} from "../../utils/helpers";
import {setupTestEventImage} from "../../utils/imageUtils";

describe('Events Handler', () => {
  // Sample event data for testing
  const sampleEvent = {
    title: 'Test Event',
    date: '2023-12-25',
    location: 'Test Location',
    description: 'Test Description',
    image: 'events/test.webp'
  };
  // Setup valid auth token
  const validToken = createTestToken({ username: 'admin' });
  const validAuthHeader = { 'Authorization': `Bearer ${validToken}` };

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

    // Helper function to insert test events into the database
  const insertTestEvents = async (events) => {
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
  const readTestEvents = async () => {
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

  describe('getEvents', () => {
    test('should return events when authenticated', async () => {
      // Set up test data
      const testEvents = [
        { id: 1, ...sampleEvent }
      ];
      await insertTestEvents(testEvents);

      // Create a request with valid auth
      const request = createTestRequest({
        method: 'GET',
        headers: validAuthHeader
      });

      // Call the handler
      const response = await getEvents(request);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(1);
      expect(data[0].id).toBe(1);
      expect(data[0].title).toBe(sampleEvent.title);
    });

    test('should return 401 when not authenticated', async () => {
      // Create a request without auth
      const request = createTestRequest({
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
      // Create a request with valid auth and event data
      const request = createTestRequest({
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
      expect(data.event.title).toBe(sampleEvent.title);
      expect(data.event.id).toBeDefined();

      // Verify the event was actually saved to the file
      const savedEvents = await readTestEvents();
      expect(savedEvents.length).toBe(1);
      expect(savedEvents[0].title).toBe(sampleEvent.title);
      expect(savedEvents[0].id).toBe(data.event.id);
    });

    test('should return 401 when not authenticated', async () => {
      // Create a request without auth
      const request = createTestRequest({
        method: 'POST',
        body: sampleEvent
      });

      // Call the handler
      const response = await createEvent(request);

      // Verify the response
      expect(response.status).toBe(401);

      // Verify no event was saved
      const savedEvents = await readTestEvents();
      expect(savedEvents.length).toBe(0);
    });
  });

  describe('updateEvent', () => {
    test('should update an existing event when authenticated', async () => {
      // Setup existing events
      const existingEvents = [
        { id: 1, ...sampleEvent }
      ];
      await insertTestEvents(existingEvents);

      // Create updated event data
      const updatedEvent = {
        ...sampleEvent,
        name: 'Updated Event Name'
      };

      // Create a request with valid auth and updated event data
      const request = createTestRequest({
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
      expect(data.event.title).toBe(updatedEvent.title);
      expect(data.event.id).toBe(1);

      // Verify the event was actually updated in the file
      const savedEvents = await readTestEvents();
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
        body: sampleEvent
      });

      // Call the handler
      const response = await updateEvent(request, 999);
      const data = await response.json();

      // Verify the response
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);

      // Verify no event was added
      const savedEvents = await readTestEvents();
      expect(savedEvents.length).toBe(0);
    });

    test('should return 401 when not authenticated', async () => {
      // Setup existing events
      const existingEvents = [
        { id: 1, ...sampleEvent }
      ];
      await insertTestEvents(existingEvents);

      // Create a request without auth
      const request = createTestRequest({
        method: 'PUT',
        body: sampleEvent
      });

      // Call the handler
      const response = await updateEvent(request, 1);

      // Verify the response
      expect(response.status).toBe(401);

      // Verify the event was not modified
      const savedEvents = await readTestEvents();
      expect(savedEvents.length).toBe(1);
      expect(savedEvents[0].title).toBe(sampleEvent.title);
    });
  });

  describe('deleteEvent', () => {
    test('should delete an existing event when authenticated', async () => {
      // Setup existing events
      const existingEvents = [
        { id: 1, ...sampleEvent }
      ];
      await insertTestEvents(existingEvents);
      await setupTestEventImage("events");

      // Create a request with valid auth
      const request = createTestRequest({
        method: 'DELETE',
        headers: validAuthHeader
      });

      // Call the handler
      const response = await deleteEvent(request, 1);
      const data = await response.json();

      if (response.status !== 200) {
        console.log(JSON.stringify(data, null, 2));
      }

      // Verify the response
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      // Verify the event was actually deleted from the file
      const savedEvents = await readTestEvents();
      expect(savedEvents.length).toBe(0);
    });

    test('should return 404 when event does not exist', async () => {
      // Start with empty events
      await testSql`TRUNCATE TABLE events RESTART IDENTITY CASCADE`;

      // Create a request with valid auth
      const request = createTestRequest({
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
      // Setup existing events
      const existingEvents = [
        { id: 1, ...sampleEvent }
      ];
      await insertTestEvents(existingEvents);

      // Create a request without auth
      const request = createTestRequest({
        method: 'DELETE'
      });

      // Call the handler
      const response = await deleteEvent(request, 1);

      // Verify the response
      expect(response.status).toBe(401);

      // Verify the event was not deleted
      const savedEvents = await readTestEvents();
      expect(savedEvents.length).toBe(1);
    });
  });
});
