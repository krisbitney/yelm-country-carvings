import { useEffect, useState } from 'react';
import { GalleryImage } from '../../types.ts';

// Import gallery images for fallback
import loadingIndicator from '../../assets/img/fallback/loading.webp';
// Use the same image for error indicator until a proper error.png is created
const errorIndicator = loadingIndicator;

export const useGalleryImages = () => {
  // State for gallery images
  const [data, setData] = useState<GalleryImage[]>([
    { id: 0, src: loadingIndicator, alt: 'Loading indicator' },
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch gallery images from the API
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/gallery');

        if (!response.ok) {
          throw new Error('Failed to fetch gallery images');
        }

        const images: GalleryImage[] = await response.json();
        setData(images);
        setError(null);
      } catch (err) {
        console.error('Error fetching gallery images:', err);
        setError('Failed to load gallery images. Please try again later.');
        setData([{ id: 0, src: errorIndicator, alt: 'Error loading gallery images' }]);
      } finally {
        setLoading(false);
      }
    };

    void fetchGalleryImages();
  }, []);

  return { data, loading, error };
};
