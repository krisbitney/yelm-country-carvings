import sql from '../utils/db';
import { GalleryImage } from '../types';

export const galleryRepository = {
  // Get all gallery images
  async getAll(): Promise<GalleryImage[]> {
    try {
      const gallery = await sql`
        SELECT 
          id, 
          src, 
          alt, 
          order_position as "order" 
        FROM gallery 
        ORDER BY order_position
      `;
      return gallery;
    } catch (error) {
      console.error('Database error in getAll gallery:', error);
      throw new Error('Failed to retrieve gallery images');
    }
  },

  // Get gallery image by ID
  async getById(id: number): Promise<GalleryImage | null> {
    try {
      const [image] = await sql`
        SELECT 
          id, 
          src, 
          alt, 
          order_position as "order" 
        FROM gallery 
        WHERE id = ${id}
      `;
      return image || null;
    } catch (error) {
      console.error(`Database error in getById(${id}):`, error);
      throw new Error(`Failed to retrieve gallery image with ID ${id}`);
    }
  },

  // Create a new gallery image
  async create(image: Omit<GalleryImage, 'id'> & { order: number }): Promise<GalleryImage> {
    try {
      const [newImage] = await sql`
        INSERT INTO gallery (
          src, 
          alt, 
          order_position
        ) 
        VALUES (
          ${image.src}, 
          ${image.alt}, 
          ${image.order}
        ) 
        RETURNING 
          id, 
          src, 
          alt, 
          order_position as "order"
      `;
      return newImage;
    } catch (error) {
      console.error('Database error in create gallery image:', error);
      throw new Error('Failed to create gallery image');
    }
  },

  // Delete a gallery image
  async delete(id: number): Promise<boolean> {
    try {
      const result = await sql`
        DELETE FROM gallery 
        WHERE id = ${id} 
        RETURNING id
      `;
      return result.length > 0;
    } catch (error) {
      console.error(`Database error in delete gallery image(${id}):`, error);
      throw new Error(`Failed to delete gallery image with ID ${id}`);
    }
  },

  // Reorder gallery images
  async reorder(orderedIds: number[]): Promise<boolean> {
    try {
      // Use transaction for atomic operation
      await sql.begin(async (tx) => {
        // Update the order of each image
        for (let i = 0; i < orderedIds.length; i++) {
          await tx`
            UPDATE gallery 
            SET order_position = ${i + 1} 
            WHERE id = ${orderedIds[i]}
          `;
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error reordering gallery:', error);
      throw new Error('Failed to reorder gallery images');
    }
  }
};