import fs from 'fs/promises';
import path from 'path';
import { galleryRepository } from '../../repositories/galleryRepository';
import {IMAGES_DIR} from "../../index";

/**
 * Get all gallery images
 * @returns A Response object with the gallery images
 */
export const getGallery = async (): Promise<Response> => {
  try {
    const gallery = await galleryRepository.getAll();
    return Response.json(gallery);
  } catch (error) {
    console.error('Error getting gallery:', error);
    return Response.json({ 
      success: false, 
      message: 'Failed to get gallery' 
    }, { status: 500 });
  }
};

/**
 * Add a new gallery image
 * @param req - The request object
 * @returns A Response object with the result
 */
export const addGalleryImage = async (req: Request): Promise<Response> => {
  try {
    // Parse the request body
    const imageData = await req.json();

    // Validate required fields
    const requiredFields = ['src', 'alt'];
    for (const field of requiredFields) {
      if (!imageData[field]) {
        return Response.json({ 
          success: false, 
          message: `Missing required field: ${field}` 
        }, { status: 400 });
      }
    }

    // TODO: i can do this just by counting the images and adding 1
    // Get all gallery images to determine the next order
    const gallery = await galleryRepository.getAll();

    // Generate the next order number
    const nextOrder = gallery.length > 0
      ? Math.max(...gallery.map(img => img.order || 0)) + 1
      : 1;

    // Create the new gallery image
    const newImage = await galleryRepository.create({
      ...imageData,
      order: nextOrder
    });

    return Response.json({ 
      success: true, 
      image: newImage,
      message: 'Gallery image added successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding gallery image:', error);
    return Response.json({ 
      success: false, 
      message: 'Failed to add gallery image' 
    }, { status: 500 });
  }
};

/**
 * Delete a gallery image
 * @param id - The ID of the image to delete
 * @returns A Response object with the result
 */
export const deleteGalleryImage = async (id: number): Promise<Response> => {
  try {
    // Get the image to delete (for file cleanup)
    const imageToDelete = await galleryRepository.getById(id);

    // If the image doesn't exist, return 404
    if (!imageToDelete) {
      return Response.json({ 
        success: false, 
        message: 'Gallery image not found' 
      }, { status: 404 });
    }

    // Delete the image from the database
    const deleted = await galleryRepository.delete(id);

    if (!deleted) {
      return Response.json({ 
        success: false, 
        message: 'Failed to delete gallery image' 
      }, { status: 500 });
    }

    // Try to delete the associated image file if it exists
    if (imageToDelete.src && imageToDelete.src.startsWith('gallery/')) {
      try {
        const imagePath = path.resolve(path.join(IMAGES_DIR, imageToDelete.src));
        await fs.unlink(imagePath);
      } catch (error) {
        // Log but don't fail if image deletion fails
        console.warn('Failed to delete gallery image file:', error);
      }
    }

    return Response.json({ 
      success: true, 
      message: 'Gallery image deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return Response.json({ 
      success: false, 
      message: 'Failed to delete gallery image' 
    }, { status: 500 });
  }
};

/**
 * Reorder gallery images
 * @param req - The request object
 * @returns A Response object with the result
 */
export const reorderGallery = async (req: Request): Promise<Response> => {
  try {
    // Parse the request body to get the new order of image IDs
    const { imageIds } = await req.json();

    // Validate the input
    if (!Array.isArray(imageIds)) {
      return Response.json({ 
        success: false, 
        message: 'Invalid input: imageIds must be an array' 
      }, { status: 400 });
    }

    // Reorder the gallery
    await galleryRepository.reorder(imageIds);

    // Get the updated gallery
    const reorderedGallery = await galleryRepository.getAll();

    return Response.json({ 
      success: true, 
      gallery: reorderedGallery,
      message: 'Gallery reordered successfully' 
    });
  } catch (error) {
    console.error('Error reordering gallery:', error);
    return Response.json({ 
      success: false, 
      message: 'Failed to reorder gallery' 
    }, { status: 500 });
  }
};
