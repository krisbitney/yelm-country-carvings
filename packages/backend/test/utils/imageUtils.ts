import path from "path";
import fs from "fs/promises";

export const TEST_IMAGE_DIR = path.resolve(path.join(__dirname, '..', 'test-images'));
export const TEST_IMAGE = path.join(TEST_IMAGE_DIR, "test.webp");

export const setupTestEventImage = async (subdir: "gallery" | "events") => {
  try {
    const destDir = path.join(TEST_IMAGE_DIR, subdir);
    await fs.mkdir(destDir, {recursive: true});
    const filename = path.basename(TEST_IMAGE);
    const filepath = path.join(destDir, filename);
    await fs.copyFile(TEST_IMAGE, filepath);
  } catch (error) {
    console.error('Error setting up test event image:', error);
  }
};

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
      await fs.unlink(path.join(eventsDir, file)).catch(() => {
      });
    }

    for (const file of galleryFiles) {
      await fs.unlink(path.join(galleryDir, file)).catch(() => {
      });
    }
  } catch (error) {
    // Ignore errors if directories don't exist
    console.warn('Warning: Could not clean up test image directories:', error);
  }
};