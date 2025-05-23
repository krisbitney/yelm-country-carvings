import '../../src/index';
import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'bun:test';
import { closeTestDb, setupTestDb, teardownTestDb } from '../utils/testDb';
const { eventRepository } = await import('../../src/repositories/eventRepository');

describe('Event Repository', () => {
  let testSql: Bun.SQL;

  beforeAll(async () => {
    testSql = await setupTestDb();
  });

  afterAll(async () => {
    await closeTestDb(testSql);
  });

  beforeEach(async () => {
    await teardownTestDb(testSql);
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
      end_date: new Date('2023-01-02'),
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
        ${testEvent.start_date.toISOString()}, 
        ${testEvent.end_date.toISOString()}
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

  it('should filter events by year', async () => {
    // Create test events with different years
    const event2022 = {
      title: 'Event 2022',
      date: 'January 1, 2022',
      location: 'Test Location',
      description: 'Test Description',
      image: '/img/events/test.jpg',
      start_date: new Date('2022-01-01'),
      end_date: new Date('2022-01-02'),
    };

    const event2023 = {
      title: 'Event 2023',
      date: 'January 1, 2023',
      location: 'Test Location',
      description: 'Test Description',
      image: '/img/events/test.jpg',
      start_date: new Date('2023-01-01'),
      end_date: new Date('2023-01-02'),
    };

    const event2024 = {
      title: 'Event 2024',
      date: 'January 1, 2024',
      location: 'Test Location',
      description: 'Test Description',
      image: '/img/events/test.jpg',
      start_date: new Date('2024-01-01'),
      end_date: new Date('2024-01-02'),
    };

    // Insert events
    await testSql`
      INSERT INTO events (title, date, location, description, image, start_date, end_date)
      VALUES 
        (${event2022.title}, ${event2022.date}, ${event2022.location}, ${event2022.description}, 
         ${event2022.image}, ${event2022.start_date.toISOString()}, ${event2022.end_date.toISOString()}),
        (${event2023.title}, ${event2023.date}, ${event2023.location}, ${event2023.description}, 
         ${event2023.image}, ${event2023.start_date.toISOString()}, ${event2023.end_date.toISOString()}),
        (${event2024.title}, ${event2024.date}, ${event2024.location}, ${event2024.description}, 
         ${event2024.image}, ${event2024.start_date.toISOString()}, ${event2024.end_date.toISOString()})
    `;

    // Test filtering by year 2023
    const events2023 = await eventRepository.getAll(2023);
    expect(events2023).toHaveLength(1);
    expect(events2023[0].title).toBe('Event 2023');

    // Test filtering by year 2024
    const events2024 = await eventRepository.getAll(2024);
    expect(events2024).toHaveLength(1);
    expect(events2024[0].title).toBe('Event 2024');

    // Test getting all events (no year filter)
    const allEvents = await eventRepository.getAll();
    expect(allEvents).toHaveLength(3);
  });

  // TODO: Add more tests for update, delete, etc.
});
