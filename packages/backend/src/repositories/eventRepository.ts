import sql from '../utils/db';
import { MarketEvent } from '../types';

export const eventRepository = {
  // Get all available years that have events
  async getAvailableYears(): Promise<number[]> {
    try {
      const result = await sql`
        SELECT DISTINCT EXTRACT(YEAR FROM start_date)::integer as year
        FROM events
        ORDER BY year DESC
      `;
      return result.map((row: { year: number }) => row.year);
    } catch (error) {
      console.error('Database error in getAvailableYears:', error);
      throw new Error('Failed to retrieve available years');
    }
  },

  // Get all events, optionally filtered by year
  async getAll(year?: number): Promise<MarketEvent[]> {
    try {
      let query;

      if (year) {
        // Filter events by the year in the start_date
        query = sql`
          SELECT 
            id, 
            title, 
            location, 
            description, 
            image, 
            start_date as "startDate", 
            end_date as "endDate" 
          FROM events 
          WHERE EXTRACT(YEAR FROM start_date) = ${year}
          ORDER BY start_date
        `;
      } else {
        // Get all events without filtering
        query = sql`
          SELECT 
            id, 
            title, 
            location, 
            description, 
            image, 
            start_date as "startDate", 
            end_date as "endDate" 
          FROM events 
          ORDER BY start_date
        `;
      }

      return await query;
    } catch (error) {
      console.error('Database error in getAll events:', error);
      throw new Error('Failed to retrieve events');
    }
  },

  // Get upcoming events (3 nearest in the future)
  async getUpcoming(): Promise<MarketEvent[]> {
    try {
      const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

      return await sql`
        SELECT 
          id, 
          title, 
          location, 
          description, 
          image, 
          start_date as "startDate", 
          end_date as "endDate" 
        FROM events 
        WHERE start_date >= ${currentDate}
        ORDER BY start_date ASC
        LIMIT 3
      `;
    } catch (error) {
      console.error('Database error in getUpcoming events:', error);
      throw new Error('Failed to retrieve upcoming events');
    }
  },

  // Get event by ID
  async getById(id: number): Promise<MarketEvent | null> {
    try {
      const [event] = await sql`
        SELECT 
          id, 
          title, 
          location, 
          description, 
          image, 
          start_date as "startDate", 
          end_date as "endDate" 
        FROM events 
        WHERE id = ${id}
      `;
      return event || null;
    } catch (error) {
      console.error(`Database error in getById(${id}):`, error);
      throw new Error(`Failed to retrieve event with ID ${id}`);
    }
  },

  // Create a new event
  async create(event: Omit<MarketEvent, 'id'>): Promise<MarketEvent> {
    try {
      const [newEvent] = await sql`
        INSERT INTO events (
          title, 
          location, 
          description, 
          image, 
          start_date, 
          end_date
        ) 
        VALUES (
          ${event.title}, 
          ${event.location}, 
          ${event.description}, 
          ${event.image}, 
          ${event.startDate}, 
          ${event.endDate}
        ) 
        RETURNING 
          id, 
          title, 
          location, 
          description, 
          image, 
          start_date as "startDate", 
          end_date as "endDate"
      `;
      return newEvent;
    } catch (error) {
      console.error('Database error in create event:', error);
      throw new Error('Failed to create event');
    }
  },

  // Update an event
  async update(id: number, event: Partial<MarketEvent>): Promise<MarketEvent | null> {
    try {
      // Get the current event
      const currentEvent = await this.getById(id);
      if (!currentEvent) return null;

      // Update the event using object helper for cleaner syntax
      const updateData = {
        title: event.title || currentEvent.title,
        location: event.location || currentEvent.location,
        description: event.description || currentEvent.description,
        image: event.image || currentEvent.image,
        start_date: event.startDate || currentEvent.startDate,
        end_date: event.endDate || currentEvent.endDate,
      };

      const [updatedEvent] = await sql`
        UPDATE events 
        SET ${sql(updateData)}
        WHERE id = ${id}
        RETURNING 
          id, 
          title, 
          location, 
          description, 
          image, 
          start_date as "startDate", 
          end_date as "endDate"
      `;

      return updatedEvent;
    } catch (error) {
      console.error(`Database error in update event(${id}):`, error);
      throw new Error(`Failed to update event with ID ${id}`);
    }
  },

  // Delete an event
  async delete(id: number): Promise<boolean> {
    try {
      const result = await sql`
        DELETE FROM events 
        WHERE id = ${id} 
        RETURNING id
      `;
      return result.length > 0;
    } catch (error) {
      console.error(`Database error in delete event(${id}):`, error);
      throw new Error(`Failed to delete event with ID ${id}`);
    }
  },
};
