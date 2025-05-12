// Import setup first to ensure environment variables are set
import '../../setup';
import { describe, test, expect, beforeEach } from 'bun:test';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../../src/handlers/admin/events';
import { createMockRequest, createTestToken, TEST_EVENTS_FILE } from '../../setup';
import fs from 'fs/promises';

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

  // Helper function to write test events to the file
  const writeTestEvents = async (events) => {
    await fs.writeFile(TEST_EVENTS_FILE, JSON.stringify(events));
  };

  // Helper function to read test events from the file
  const readTestEvents = async () => {
    const data = await fs.readFile(TEST_EVENTS_FILE, 'utf-8');
    return JSON.parse(data);
  };

  beforeEach(async () => {
    // Initialize with empty events for each test
    await writeTestEvents([]);
  });

  describe('getEvents', () => {
    test('should return events when authenticated', async () => {
      // Set up test data
      const testEvents = [
        { id: 1, ...sampleEvent }
      ];
      await writeTestEvents(testEvents);

      // Create a request with valid auth
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
      expect(data.length).toBe(1);
      expect(data[0].id).toBe(1);
      expect(data[0].name).toBe(sampleEvent.name);
    });

    test('should return 401 when not authenticated', async () => {
      // Create a request without auth
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
      // Create a request with valid auth and event data
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

      // Verify the event was actually saved to the file
      const savedEvents = await readTestEvents();
      expect(savedEvents.length).toBe(1);
      expect(savedEvents[0].name).toBe(sampleEvent.name);
      expect(savedEvents[0].id).toBe(data.event.id);
    });

    test('should return 401 when not authenticated', async () => {
      // Create a request without auth
      const request = createMockRequest({
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
      await writeTestEvents(existingEvents);

      // Create updated event data
      const updatedEvent = {
        ...sampleEvent,
        name: 'Updated Event Name'
      };

      // Create a request with valid auth and updated event data
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

      // Verify the event was actually updated in the file
      const savedEvents = await readTestEvents();
      expect(savedEvents.length).toBe(1);
      expect(savedEvents[0].name).toBe(updatedEvent.name);
      expect(savedEvents[0].id).toBe(1);
    });

    test('should return 404 when event does not exist', async () => {
      // Start with empty events
      await writeTestEvents([]);

      // Create a request with valid auth and event data
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

      // Verify no event was added
      const savedEvents = await readTestEvents();
      expect(savedEvents.length).toBe(0);
    });

    test('should return 401 when not authenticated', async () => {
      // Setup existing events
      const existingEvents = [
        { id: 1, ...sampleEvent }
      ];
      await writeTestEvents(existingEvents);

      // Create a request without auth
      const request = createMockRequest({
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
      expect(savedEvents[0].name).toBe(sampleEvent.name);
    });
  });

  describe('deleteEvent', () => {
    test('should delete an existing event when authenticated', async () => {
      // Setup existing events
      const existingEvents = [
        { id: 1, ...sampleEvent }
      ];
      await writeTestEvents(existingEvents);

      // Create a request with valid auth
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

      // Verify the event was actually deleted from the file
      const savedEvents = await readTestEvents();
      expect(savedEvents.length).toBe(0);
    });

    test('should return 404 when event does not exist', async () => {
      // Start with empty events
      await writeTestEvents([]);

      // Create a request with valid auth
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
      // Setup existing events
      const existingEvents = [
        { id: 1, ...sampleEvent }
      ];
      await writeTestEvents(existingEvents);

      // Create a request without auth
      const request = createMockRequest({
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
