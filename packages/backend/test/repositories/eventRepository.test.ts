import { describe, it, expect, beforeAll, afterAll, afterEach } from 'bun:test';
import { setupTestDb, teardownTestDb, closeTestDb } from '../utils/testDb';
import {SQL} from "bun";

describe('Event Repository', () => {
  let testSql: SQL;

  beforeAll(async () => {
    testSql = await setupTestDb();
  });

  afterEach(async () => {
    await teardownTestDb(testSql);
  });

  afterAll(async () => {
    await closeTestDb(testSql);
  });

  it('should create and retrieve an event', async () => {
    // Create test event
    const testEvent = {
      title: 'Test Event',
      date: 'January 1, 2023',
      location: 'Test Location',
      description: 'Test Description',
      image: '/img/events/test.jpg',
      start_date: new Date('2023-01-01'),
      end_date: new Date('2023-01-02')
    };

    // Create event
    const [createdEvent] = await testSql`
      INSERT INTO events (
        title, 
        date, 
        location, 
        description, 
        image, 
        start_date, 
        end_date
      ) 
      VALUES (
        ${testEvent.title}, 
        ${testEvent.date}, 
        ${testEvent.location}, 
        ${testEvent.description}, 
        ${testEvent.image}, 
        ${testEvent.start_date}, 
        ${testEvent.end_date}
      ) 
      RETURNING 
        id, 
        title, 
        date, 
        location, 
        description, 
        image, 
        start_date as "startDate", 
        end_date as "endDate"
    `;
    
    expect(createdEvent).toBeDefined();
    expect(createdEvent.id).toBeDefined();
    expect(createdEvent.title).toBe(testEvent.title);

    // Get all events
    const events = await testSql`
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
    `;
    
    expect(events).toHaveLength(1);
    expect(events[0].id).toBe(createdEvent.id);

    // Get event by ID
    const [retrievedEvent] = await testSql`
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
      WHERE id = ${createdEvent.id}
    `;
    
    expect(retrievedEvent).toBeDefined();
    expect(retrievedEvent.title).toBe(testEvent.title);
  });

  // Add more tests for update, delete, etc.
});