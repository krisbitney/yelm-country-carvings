import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useAdminAuth } from './useAdminAuth';
import { MarketEvent } from '../../types.ts';

interface UseAdminEventsReturn {
  events: MarketEvent[];
  loading: boolean;
  error: string | null;
  fetchEvents: (year?: number) => Promise<void>;
  fetchAvailableYears: () => Promise<number[]>;
  createEvent: (event: Omit<MarketEvent, 'id'>) => Promise<boolean>;
  updateEvent: (id: number, event: Partial<MarketEvent>) => Promise<boolean>;
  deleteEvent: (id: number) => Promise<boolean>;
  uploadEventImage: (file: File) => Promise<string | null>;
}

/**
 * Hook for managing events in the admin portal
 */
export const useAdminEvents = (): UseAdminEventsReturn => {
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { authFetch } = useAdminAuth();

  /**
   * Fetch all events, optionally filtered by year
   * @param year - Optional year to filter events by
   */
  const fetchEvents = useCallback(
    async (year?: number) => {
      try {
        setLoading(true);
        setError(null);

        // Construct URL with optional year parameter
        let url = '/api/admin/events';
        if (year) {
          url += `?year=${year}`;
        }

        const response = await authFetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    },
    [authFetch]
  );

  /**
   * Create a new event
   * @param event - The event data
   * @returns Whether the operation was successful
   */
  const createEvent = useCallback(
    async (event: Omit<MarketEvent, 'id'>): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await authFetch('/api/admin/events', {
          method: 'POST',
          body: JSON.stringify(event),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create event');
        }

        const data = await response.json();

        // Update the local state with the new event
        setEvents(prevEvents => [...prevEvents, data.event]);

        toast.success('Event created successfully');
        return true;
      } catch (error) {
        console.error('Error creating event:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        toast.error('Failed to create event');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [authFetch]
  );

  /**
   * Update an existing event
   * @param id - The ID of the event to update
   * @param event - The updated event data
   * @returns Whether the operation was successful
   */
  const updateEvent = useCallback(
    async (id: number, event: Partial<MarketEvent>): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await authFetch(`/api/admin/events/${id}`, {
          method: 'PUT',
          body: JSON.stringify(event),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update event');
        }

        const data = await response.json();

        // Update the local state with the updated event
        setEvents(prevEvents => prevEvents.map(e => (e.id === id ? data.event : e)));

        toast.success('Event updated successfully');
        return true;
      } catch (error) {
        console.error('Error updating event:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        toast.error('Failed to update event');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [authFetch]
  );

  /**
   * Delete an event
   * @param id - The ID of the event to delete
   * @returns Whether the operation was successful
   */
  const deleteEvent = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await authFetch(`/api/admin/events/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete event');
        }

        // Update the local state by removing the deleted event
        setEvents(prevEvents => prevEvents.filter(e => e.id !== id));

        toast.success('Event deleted successfully');
        return true;
      } catch (error) {
        console.error('Error deleting event:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        toast.error('Failed to delete event');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [authFetch]
  );

  /**
   * Upload an event image
   * @param file - The image file to upload
   * @returns The path to the uploaded image, or null if the upload failed
   */
  const uploadEventImage = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        setLoading(true);
        setError(null);

        console.log('uploadEventImage called with file:', file.name, file.type, file.size);

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', 'events');

        // Log FormData contents (for debugging)
        console.log('FormData created with:');
        for (const pair of formData.entries()) {
          console.log(`- ${pair[0]}: ${pair[1]}`);
        }

        const response = await authFetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        console.log('Upload response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Upload error response:', errorText);
          let errorMessage = 'Failed to upload image';
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          } catch {
            // If the response is not valid JSON, use the error text
            errorMessage = errorText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('Upload success response:', data);

        toast.success('Image uploaded successfully');
        return data.imagePath;
      } catch (error) {
        console.error('Error uploading image:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        toast.error('Failed to upload image');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [authFetch]
  );

  /**
   * Fetch all available years that have events
   * @returns Array of years
   */
  const fetchAvailableYears = useCallback(async (): Promise<number[]> => {
    try {
      const response = await authFetch('/api/admin/events/years');

      if (!response.ok) {
        throw new Error('Failed to fetch available years');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching available years:', error);
      toast.error('Failed to load available years');
      return [];
    }
  }, [authFetch]);

  return {
    events,
    loading,
    error,
    fetchEvents,
    fetchAvailableYears,
    createEvent,
    updateEvent,
    deleteEvent,
    uploadEventImage,
  };
};
