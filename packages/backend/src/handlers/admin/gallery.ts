import fs from 'fs/promises';
import path from 'path';
import { galleryRepository } from '../../repositories/galleryRepository';
import { IMAGES_DIR } from '../../index';
import { createAPIResponse, createErrorResponse } from '../../utils/headers';

/**
 * Get all gallery images
 * @returns A Response object with the gallery images
 */
export const getGallery = async (): Promise<Response> => {
  try {
    const gallery = await galleryRepository.getAll();
    return await createAPIResponse(gallery);
  } catch (error) {
    console.error('Error getting gallery:', error);
    return await createErrorResponse('Failed to get gallery', 500);
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
        return await createErrorResponse(`Missing required field: ${field}`, 400);
      }
    }

    // TODO: i can do this just by counting the images and adding 1
    // Get all gallery images to determine the next order
    const gallery = await galleryRepository.getAll();

    // Generate the next order number
    const nextOrder = gallery.length > 0 ? Math.max(...gallery.map(img => img.order || 0)) + 1 : 1;

    // Create the new gallery image
    const newImage = await galleryRepository.create({
      ...imageData,
      order: nextOrder,
    });

    return await createAPIResponse({
      success: true,
      image: newImage,
      message: 'Gallery image added successfully',
    }, 201);
  } catch (error) {
    console.error('Error adding gallery image:', error);
    return await createErrorResponse('Failed to add gallery image', 500);
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
      return await createErrorResponse('Gallery image not found', 404);
    }

    // Delete the image from the database
    const deleted = await galleryRepository.delete(id);

    if (!deleted) {
      return await createErrorResponse('Failed to delete gallery image', 500);
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

    return await createAPIResponse({
      success: true,
      message: 'Gallery image deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return await createErrorResponse('Failed to delete gallery image', 500);
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
      return await createErrorResponse('Invalid input: imageIds must be an array', 400);
    }

    // Reorder the gallery
    await galleryRepository.reorder(imageIds);

    // Get the updated gallery
    const reorderedGallery = await galleryRepository.getAll();

    return await createAPIResponse({
      success: true,
      gallery: reorderedGallery,
      message: 'Gallery reordered successfully',
    });
  } catch (error) {
    console.error('Error reordering gallery:', error);
    return await createErrorResponse('Failed to reorder gallery', 500);
  }
};
