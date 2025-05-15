import path from 'path';
import sharp from 'sharp';
import {IMAGES_DIR} from "../../index";

/**
 * Process and save an uploaded image
 * @param imageBuffer - The image buffer
 * @param filename - The filename to save as
 * @param type - The type of image (events or gallery)
 * @returns The path to the saved image
 */
const processAndSaveImage = async (
  imageBuffer: Buffer,
  filename: string,
  type: 'events' | 'gallery'
): Promise<string> => {
  // Create a unique filename
  const timestamp = Date.now();
  const extension = '.webp'; // Convert all images to webp for better compression
  const uniqueFilename = `${path.basename(filename, path.extname(filename))}_${timestamp}${extension}`;

  // Determine the directory and path
  const directory = path.join(IMAGES_DIR, type);
  const imagePath = path.join(directory, uniqueFilename);

  // Process the image with sharp
  await sharp(imageBuffer)
    .resize(1200, 800, { fit: 'inside', withoutEnlargement: true }) // Resize to reasonable dimensions
    .webp({ quality: 80 }) // Convert to webp with good quality
    .toFile(imagePath);

  // Return the relative path for storage in the database
  return `${type}/${uniqueFilename}`;
};

/**
 * Handle image upload
 * @param req - The request object
 * @returns A Response object with the result
 */
export const handleImageUpload = async (req: Request): Promise<Response> => {
  try {
    // Check if the request is multipart/form-data
    const contentType = req.headers.get('Content-Type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return Response.json({
        success: false,
        message: 'Request must be multipart/form-data'
      }, { status: 400 });
    }

    // Parse the form data
    const formData = await req.formData();

    // Get the image type (events or gallery)
    const type = formData.get('type') as 'events' | 'gallery' | null;
    if (!type || (type !== 'events' && type !== 'gallery')) {
      return Response.json({
        success: false,
        message: 'Invalid or missing image type (must be "events" or "gallery")'
      }, { status: 400 });
    }

    // Get the image file
    const imageFile = formData.get('image') as File | null;
    if (!imageFile) {
      return Response.json({
        success: false,
        message: 'No image file provided'
      }, { status: 400 });
    }

    // Convert the file to a buffer
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    // Process and save the image
    const imagePath = await processAndSaveImage(imageBuffer, imageFile.name, type);

    // Return the path to the saved image
    return Response.json({
      success: true,
      imagePath,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return Response.json({
      success: false,
      message: 'Failed to upload image'
    }, { status: 500 });
  }
};
