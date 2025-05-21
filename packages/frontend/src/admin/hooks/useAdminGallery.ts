import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAdminAuth } from './useAdminAuth';
import { GalleryImage } from '../../types.ts';

interface UseAdminGalleryReturn {
  gallery: GalleryImage[];
  loading: boolean;
  error: string | null;
  fetchGallery: () => Promise<void>;
  addGalleryImage: (image: Omit<GalleryImage, 'id'>) => Promise<boolean>;
  deleteGalleryImage: (id: number) => Promise<boolean>;
  reorderGallery: (imageIds: number[]) => Promise<boolean>;
  uploadGalleryImage: (file: File) => Promise<string | null>;
}

/**
 * Hook for managing gallery images in the admin portal
 */
export const useAdminGallery = (): UseAdminGalleryReturn => {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { authFetch } = useAdminAuth();

  /**
   * Fetch all gallery images
   */
  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authFetch('/api/admin/gallery');

      if (!response.ok) {
        throw new Error('Failed to fetch gallery images');
      }

      const data = await response.json();
      setGallery(data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      toast.error('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  /**
   * Add a new gallery image
   * @param image - The image data
   * @returns Whether the operation was successful
   */
  const addGalleryImage = useCallback(
    async (image: Omit<GalleryImage, 'id'>): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await authFetch('/api/admin/gallery', {
          method: 'POST',
          body: JSON.stringify(image),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add gallery image');
        }

        const data = await response.json();

        // Update the local state with the new image
        setGallery(prevGallery => [...prevGallery, data.image]);

        toast.success('Gallery image added successfully');
        return true;
      } catch (error) {
        console.error('Error adding gallery image:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        toast.error('Failed to add gallery image');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [authFetch]
  );

  /**
   * Delete a gallery image
   * @param id - The ID of the image to delete
   * @returns Whether the operation was successful
   */
  const deleteGalleryImage = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await authFetch(`/api/admin/gallery/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete gallery image');
        }

        // Update the local state by removing the deleted image
        setGallery(prevGallery => prevGallery.filter(img => img.id !== id));

        toast.success('Gallery image deleted successfully');
        return true;
      } catch (error) {
        console.error('Error deleting gallery image:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        toast.error('Failed to delete gallery image');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [authFetch]
  );

  /**
   * Reorder gallery images
   * @param imageIds - The ordered array of image IDs
   * @returns Whether the operation was successful
   */
  const reorderGallery = useCallback(
    async (imageIds: number[]): Promise<boolean> => {
      try {
        setError(null);

        const response = await authFetch('/api/admin/gallery/reorder', {
          method: 'POST',
          body: JSON.stringify({ imageIds }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to reorder gallery');
        }

        const data = await response.json();

        // Update the local state with the reordered gallery
        setGallery(data.gallery);

        toast.success('Gallery reordered successfully');
        return true;
      } catch (error) {
        console.error('Error reordering gallery:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        toast.error('Failed to reorder gallery');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [authFetch]
  );

  /**
   * Upload a gallery image
   * @param file - The image file to upload
   * @returns The path to the uploaded image, or null if the upload failed
   */
  const uploadGalleryImage = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        setLoading(true);
        setError(null);

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', 'gallery');

        const response = await authFetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to upload image');
        }

        const data = await response.json();

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

  return {
    gallery,
    loading,
    error,
    fetchGallery,
    addGalleryImage,
    deleteGalleryImage,
    reorderGallery,
    uploadGalleryImage,
  };
};
