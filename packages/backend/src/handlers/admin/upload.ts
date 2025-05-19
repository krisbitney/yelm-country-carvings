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

  // Ensure the directory exists
  try {
    const fs = await import('fs');
    if (!fs.existsSync(directory)) {
      console.log(`Creating directory: ${directory}`);
      fs.mkdirSync(directory, { recursive: true });
    }
  } catch (error) {
    console.error(`Error ensuring directory exists: ${directory}`, error);
    throw new Error(`Failed to create directory: ${error}`);
  }

  console.log(`Saving image to: ${imagePath}`);

  try {
    // Process the image with sharp
    await sharp(imageBuffer)
      .resize(1200, 800, { fit: 'inside', withoutEnlargement: true }) // Resize to reasonable dimensions
      .webp({ quality: 80 }) // Convert to webp with good quality
      .toFile(imagePath);

    console.log(`Image saved successfully to: ${imagePath}`);
  } catch (error) {
    console.error(`Error processing and saving image: ${imagePath}`, error);
    throw new Error(`Failed to process and save image: ${error}`);
  }

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
    console.log('Image upload request received');

    // Check if the request is multipart/form-data
    const contentType = req.headers.get('Content-Type') || '';
    console.log('Content-Type:', contentType);

    if (!contentType.includes('multipart/form-data')) {
      console.error('Invalid Content-Type:', contentType);
      return Response.json({
        success: false,
        message: 'Request must be multipart/form-data'
      }, { status: 400 });
    }

    // Parse the form data
    let formData;
    try {
      formData = await req.formData();
      console.log('FormData parsed successfully');
    } catch (error) {
      console.error('Error parsing FormData:', error);
      return Response.json({
        success: false,
        message: `Error parsing form data: ${error}`
      }, { status: 400 });
    }

    // Log the form data entries
    console.log('FormData entries:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`- ${key}: File (name: ${value.name}, type: ${value.type}, size: ${value.size})`);
      } else {
        console.log(`- ${key}: ${value}`);
      }
    }

    // Get the image type (events or gallery)
    const type = formData.get('type') as 'events' | 'gallery' | null;
    if (!type || (type !== 'events' && type !== 'gallery')) {
      console.error('Invalid or missing image type:', type);
      return Response.json({
        success: false,
        message: 'Invalid or missing image type (must be "events" or "gallery")'
      }, { status: 400 });
    }

    // Get the image file
    const imageFile = formData.get('image') as File | null;
    if (!imageFile) {
      console.error('No image file provided');
      return Response.json({
        success: false,
        message: 'No image file provided'
      }, { status: 400 });
    }

    console.log(`Processing image: ${imageFile.name} (${imageFile.type}, ${imageFile.size} bytes)`);

    // Convert the file to a buffer
    let imageBuffer;
    try {
      imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      console.log(`Image buffer created: ${imageBuffer.length} bytes`);
    } catch (error) {
      console.error('Error creating image buffer:', error);
      return Response.json({
        success: false,
        message: `Error processing image file: ${error}`
      }, { status: 500 });
    }

    // Process and save the image
    let imagePath;
    try {
      imagePath = await processAndSaveImage(imageBuffer, imageFile.name, type);
      console.log(`Image processed and saved: ${imagePath}`);
    } catch (error) {
      console.error('Error in processAndSaveImage:', error);
      return Response.json({
        success: false,
        message: `Error saving image: ${error}`
      }, { status: 500 });
    }

    // Return the path to the saved image
    console.log('Image upload successful');
    return Response.json({
      success: true,
      imagePath,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Unhandled error in handleImageUpload:', error);
    return Response.json({
      success: false,
      message: `Failed to upload image: ${error}`
    }, { status: 500 });
  }
};
