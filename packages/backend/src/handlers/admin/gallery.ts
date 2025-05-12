import fs from 'fs/promises';
import path from 'path';
import { authenticateAdmin } from '../../middleware/auth';
import { GalleryImage } from '../../types';

// Determine if we're in test mode
const isTestMode = process.env.NODE_ENV === 'test';

// Get the appropriate file paths based on environment
let GALLERY_FILE_PATH: string;
let IMAGES_DIR: string;

if (isTestMode && process.env.TEST_GALLERY_FILE) {
  // Use test-specific paths
  GALLERY_FILE_PATH = process.env.TEST_GALLERY_FILE;
  IMAGES_DIR = path.join(path.dirname(GALLERY_FILE_PATH), 'gallery-images');
} else {
  // Use production paths
  GALLERY_FILE_PATH = path.join(import.meta.dir, '../../../data/gallery.json');
  IMAGES_DIR = path.join(import.meta.dir, '../../../img/gallery');
}

// Ensure the gallery images directory exists
try {
  await fs.mkdir(IMAGES_DIR, { recursive: true });
} catch (error) {
  console.error('Error creating gallery images directory:', error);
}

/**
 * Read gallery images from the JSON file
 * @returns Array of gallery images
 */
const readGallery = async (): Promise<GalleryImage[]> => {
  try {
    const data = await fs.readFile(GALLERY_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading gallery file:', error);
    return [];
  }
};

/**
 * Write gallery images to the JSON file
 * @param images - The gallery images to write
 */
const writeGallery = async (images: GalleryImage[]): Promise<void> => {
  try {
    await fs.writeFile(GALLERY_FILE_PATH, JSON.stringify(images, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing gallery file:', error);
    throw new Error('Failed to save gallery');
  }
};

/**
 * Get all gallery images
 * @param req - The request object
 * @returns A Response object with the gallery images
 */
export const getGallery = async (req: Request): Promise<Response> => {
  // Authenticate the request
  const authResponse = authenticateAdmin(req);
  if (authResponse) return authResponse;

  try {
    const gallery = await readGallery();
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
  // Authenticate the request
  const authResponse = authenticateAdmin(req);
  if (authResponse) return authResponse;

  try {
    // Parse the request body
    const imageData = await req.json();

    // Read existing gallery
    const gallery = await readGallery();

    // Generate a new ID
    const newId = gallery.length > 0 
      ? Math.max(...gallery.map(img => img.id)) + 1 
      : 1;

    // Generate the next order number
    const nextOrder = gallery.length > 0
      ? Math.max(...gallery.map(img => img.order || 0)) + 1
      : 1;

    // Create the new gallery image
    const newImage: GalleryImage = {
      id: newId,
      order: nextOrder,
      ...imageData
    };

    // Add the new image
    gallery.push(newImage);

    // Save the updated gallery
    await writeGallery(gallery);

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
 * @param req - The request object
 * @param id - The ID of the image to delete
 * @returns A Response object with the result
 */
export const deleteGalleryImage = async (req: Request, id: number): Promise<Response> => {
  // Authenticate the request
  const authResponse = authenticateAdmin(req);
  if (authResponse) return authResponse;

  try {
    // Read existing gallery
    const gallery = await readGallery();

    // Find the image to delete
    const imageIndex = gallery.findIndex(img => img.id === id);

    // If the image doesn't exist, return 404
    if (imageIndex === -1) {
      return Response.json({ 
        success: false, 
        message: 'Gallery image not found' 
      }, { status: 404 });
    }

    // Get the image to delete (for file cleanup)
    const imageToDelete = gallery[imageIndex];

    // Remove the image from the array
    gallery.splice(imageIndex, 1);

    // Save the updated gallery
    await writeGallery(gallery);

    // Try to delete the associated image file if it exists
    if (imageToDelete.src && imageToDelete.src.startsWith('gallery/')) {
      try {
        const imagePath = path.join(import.meta.dir, '../../../img', imageToDelete.src);
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
  // Authenticate the request
  const authResponse = authenticateAdmin(req);
  if (authResponse) return authResponse;

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

    // Read existing gallery
    const gallery = await readGallery();

    // Create a map of id -> image for quick lookup
    const imageMap = new Map(gallery.map(img => [img.id, img]));

    // Create a new array with the images in the specified order
    const reorderedGallery: GalleryImage[] = [];

    for (const id of imageIds) {
      const image = imageMap.get(id);
      if (image) {
        reorderedGallery.push(image);
        imageMap.delete(id);
      }
    }

    // Add any remaining images (that weren't in the imageIds array) at the end
    for (const image of imageMap.values()) {
      reorderedGallery.push(image);
    }

    // Save the updated gallery
    await writeGallery(reorderedGallery);

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
