import { useEffect, useState } from 'react';
import loadingImage from '../../assets/img/fallback/loading.png';
import { MarketEvent } from '../../types.ts';

const loadingEvent: MarketEvent = {
  id: 0,
  title: 'Loading...',
  location: 'Loading...',
  description: 'Loading...',
  image: loadingImage,
  startDate: '2025-01-01',
  endDate: '2025-01-01',
};

export const useEvents = () => {
  // State for events data
  const [data, setData] = useState<MarketEvent[]>([loadingEvent]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/upcoming-events');

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const events = await response.json();
        setData(events);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');

        setData([loadingEvent]);
      } finally {
        setLoading(false);
      }
    };

    void fetchEvents();
  }, []);

  return { data, loading, error };
};
