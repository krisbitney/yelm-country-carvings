import fs from 'fs/promises';
import path from 'path';
import { eventRepository } from '../../repositories/eventRepository';
import { IMAGES_DIR } from '../../index';

/**
 * Get all events
 * @param req - The request object
 * @returns A Response object with the events
 */
export const getEvents = async (): Promise<Response> => {
  try {
    const events = await eventRepository.getAll();
    return Response.json(events);
  } catch (error) {
    console.error('Error getting events:', error);
    return Response.json(
      {
        success: false,
        message: 'Failed to get events',
      },
      { status: 500 }
    );
  }
};

/**
 * Create a new event
 * @param req - The request object
 * @returns A Response object with the result
 */
export const createEvent = async (req: Request): Promise<Response> => {
  try {
    // Parse the request body
    const eventData = await req.json();

    // Validate required fields
    const requiredFields = ['title', 'date', 'location', 'description', 'image'];
    for (const field of requiredFields) {
      if (!eventData[field]) {
        return Response.json(
          {
            success: false,
            message: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    // Create the new event
    const newEvent = await eventRepository.create(eventData);

    return Response.json(
      {
        success: true,
        event: newEvent,
        message: 'Event created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return Response.json(
      {
        success: false,
        message: 'Failed to create event',
      },
      { status: 500 }
    );
  }
};

/**
 * Update an existing event
 * @param req - The request object
 * @param id - The ID of the event to update
 * @returns A Response object with the result
 */
export const updateEvent = async (req: Request, id: number): Promise<Response> => {
  try {
    // Parse the request body
    const eventData = await req.json();

    // Update the event
    const updatedEvent = await eventRepository.update(id, eventData);

    if (!updatedEvent) {
      return Response.json(
        {
          success: false,
          message: 'Event not found',
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      event: updatedEvent,
      message: 'Event updated successfully',
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return Response.json(
      {
        success: false,
        message: 'Failed to update event',
      },
      { status: 500 }
    );
  }
};

/**
 * Delete an event
 * @param id - The ID of the event to delete
 * @returns A Response object with the result
 */
export const deleteEvent = async (id: number): Promise<Response> => {
  try {
    // Get the event to delete (for image cleanup)
    const eventToDelete = await eventRepository.getById(id);

    // If the event doesn't exist, return 404
    if (!eventToDelete) {
      return Response.json(
        {
          success: false,
          message: 'Event not found',
        },
        { status: 404 }
      );
    }

    // Delete the event from the database
    const deleted = await eventRepository.delete(id);

    if (!deleted) {
      return Response.json(
        {
          success: false,
          message: 'Failed to delete event',
        },
        { status: 500 }
      );
    }

    // Try to delete the associated image if it exists
    if (eventToDelete.image && eventToDelete.image.startsWith('events/')) {
      try {
        const imagePath = path.resolve(path.join(IMAGES_DIR, eventToDelete.image));
        await fs.unlink(imagePath);
      } catch (error) {
        // Log but don't fail if image deletion fails
        console.warn('Failed to delete event image:', error);
      }
    }

    return Response.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return Response.json(
      {
        success: false,
        message: 'Failed to delete event',
      },
      { status: 500 }
    );
  }
};
