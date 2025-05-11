import {useEffect, useState} from "react";
import eatonvilleFestival from "../../../backend/src/img/events/eatonville_art_and_music_festival_2024_1.webp";

export interface MarketEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  // These fields will be calculated from the date string
  startDate?: string;
  endDate?: string;
}

const loadingEvent: MarketEvent = {
  id: 0,
  title: 'Loading...',
  date: 'Loading...',
  location: 'Loading...',
  description: 'Loading...',
  image: eatonvilleFestival,
  startDate: '2025-01-01',
  endDate: '2025-01-01'
}

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
        const response = await fetch('/api/events');

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
}