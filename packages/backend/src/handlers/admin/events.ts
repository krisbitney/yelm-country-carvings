import fs from 'fs/promises';
import path from 'path';
import { authenticateAdmin } from '../../middleware/auth';
import { MarketEvent } from '../../types';
import { eventRepository } from '../../repositories/eventRepository';

// Determine if we're in test mode
const isTestMode = process.env.NODE_ENV === 'test';

// Get the appropriate file paths based on environment
let EVENTS_FILE_PATH: string;
let IMAGES_DIR: string;

if (isTestMode && process.env.TEST_EVENTS_FILE) {
  // Use test-specific paths
  EVENTS_FILE_PATH = process.env.TEST_EVENTS_FILE;
  IMAGES_DIR = path.join(path.dirname(EVENTS_FILE_PATH), 'events-images');
} else {
  // Use production paths
  EVENTS_FILE_PATH = path.join(import.meta.dir, '../../../data/events.json');
  IMAGES_DIR = path.join(import.meta.dir, '../../../img/events');
}

// Ensure the events images directory exists
try {
  await fs.mkdir(IMAGES_DIR, { recursive: true });
} catch (error) {
  console.error('Error creating events images directory:', error);
}

/**
 * Read events from the JSON file
 * @returns Array of events
 */
const readEvents = async (): Promise<MarketEvent[]> => {
  try {
    const data = await fs.readFile(EVENTS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading events file:', error);
    return [];
  }
};

/**
 * Write events to the JSON file
 * @param events - The events to write
 */
const writeEvents = async (events: MarketEvent[]): Promise<void> => {
  try {
    await fs.writeFile(EVENTS_FILE_PATH, JSON.stringify(events, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing events file:', error);
    throw new Error('Failed to save events');
  }
};

/**
 * Get all events
 * @param req - The request object
 * @returns A Response object with the events
 */
export const getEvents = async (req: Request): Promise<Response> => {
  // Authenticate the request
  const authResponse = authenticateAdmin(req);
  if (authResponse) return authResponse;

  try {
    const events = await eventRepository.getAll();
    return Response.json(events);
  } catch (error) {
    console.error('Error getting events:', error);
    return Response.json({ 
      success: false, 
      message: 'Failed to get events' 
    }, { status: 500 });
  }
};

/**
 * Create a new event
 * @param req - The request object
 * @returns A Response object with the result
 */
export const createEvent = async (req: Request): Promise<Response> => {
  // Authenticate the request
  const authResponse = authenticateAdmin(req);
  if (authResponse) return authResponse;

  try {
    // Parse the request body
    const eventData = await req.json();

    // Validate required fields
    const requiredFields = ['title', 'date', 'location', 'description', 'image'];
    for (const field of requiredFields) {
      if (!eventData[field]) {
        return Response.json({ 
          success: false, 
          message: `Missing required field: ${field}` 
        }, { status: 400 });
      }
    }

    // Create the new event
    const newEvent = await eventRepository.create(eventData);

    return Response.json({ 
      success: true, 
      event: newEvent,
      message: 'Event created successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return Response.json({ 
      success: false, 
      message: 'Failed to create event' 
    }, { status: 500 });
  }
};

/**
 * Update an existing event
 * @param req - The request object
 * @param id - The ID of the event to update
 * @returns A Response object with the result
 */
export const updateEvent = async (req: Request, id: number): Promise<Response> => {
  // Authenticate the request
  const authResponse = authenticateAdmin(req);
  if (authResponse) return authResponse;

  try {
    // Parse the request body
    const eventData = await req.json();

    // Update the event
    const updatedEvent = await eventRepository.update(id, eventData);

    if (!updatedEvent) {
      return Response.json({ 
        success: false, 
        message: 'Event not found' 
      }, { status: 404 });
    }

    return Response.json({ 
      success: true, 
      event: updatedEvent,
      message: 'Event updated successfully' 
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return Response.json({ 
      success: false, 
      message: 'Failed to update event' 
    }, { status: 500 });
  }
};

/**
 * Delete an event
 * @param req - The request object
 * @param id - The ID of the event to delete
 * @returns A Response object with the result
 */
export const deleteEvent = async (req: Request, id: number): Promise<Response> => {
  // Authenticate the request
  const authResponse = authenticateAdmin(req);
  if (authResponse) return authResponse;

  try {
    // Get the event to delete (for image cleanup)
    const eventToDelete = await eventRepository.getById(id);

    // If the event doesn't exist, return 404
    if (!eventToDelete) {
      return Response.json({ 
        success: false, 
        message: 'Event not found' 
      }, { status: 404 });
    }

    // Delete the event from the database
    const deleted = await eventRepository.delete(id);

    if (!deleted) {
      return Response.json({ 
        success: false, 
        message: 'Failed to delete event' 
      }, { status: 500 });
    }

    // Try to delete the associated image if it exists
    if (eventToDelete.image && eventToDelete.image.startsWith('events/')) {
      try {
        // Use the appropriate image directory based on environment
        const baseImgDir = isTestMode && process.env.TEST_EVENTS_FILE
          ? path.join(path.dirname(process.env.TEST_EVENTS_FILE), 'test-img')
          : path.join(import.meta.dir, '../../../img');

        const imagePath = path.join(baseImgDir, eventToDelete.image);
        await fs.unlink(imagePath);
      } catch (error) {
        // Log but don't fail if image deletion fails
        console.warn('Failed to delete event image:', error);
      }
    }

    return Response.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return Response.json({ 
      success: false, 
      message: 'Failed to delete event' 
    }, { status: 500 });
  }
};
