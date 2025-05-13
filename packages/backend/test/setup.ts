import fs from 'fs/promises';
import path from 'path';
import dotenv from "dotenv";

dotenv.config();
// Set environment variables for test mode
process.env.NODE_ENV = 'test';

// Set up test-specific environment
export const TEST_IMAGE_DIR = path.join(__dirname, 'test-images');
export const TEST_IMAGE = path.join(TEST_IMAGE_DIR, "test.webp");

export const cleanupImageDirectories = async () => {
  try {
    // Remove all files in the events and gallery subdirectories
    const eventsDir = path.join(TEST_IMAGE_DIR, 'events');
    const galleryDir = path.join(TEST_IMAGE_DIR, 'gallery');

    // Get all files in the directories
    const eventFiles = await fs.readdir(eventsDir).catch(() => []);
    const galleryFiles = await fs.readdir(galleryDir).catch(() => []);

    // Delete each file
    for (const file of eventFiles) {
      await fs.unlink(path.join(eventsDir, file)).catch(() => {});
    }

    for (const file of galleryFiles) {
      await fs.unlink(path.join(galleryDir, file)).catch(() => {});
    }
  } catch (error) {
    // Ignore errors if directories don't exist
    console.warn('Warning: Could not clean up test image directories:', error);
  }
};
