import fs from 'fs/promises';
import path from 'path';
import sql from '../src/utils/db';
import { GalleryImage } from '../src/types';

const DATA_DIR = path.join(__dirname, '../data');
const GALLERY_FILE_PATH = path.join(DATA_DIR, 'gallery.json');

async function migrateGallery() {
  try {
    // Read gallery from JSON file
    const data = await fs.readFile(GALLERY_FILE_PATH, 'utf-8');
    const gallery: GalleryImage[] = JSON.parse(data);

    console.log(`Migrating ${gallery.length} gallery images to database...`);

    // Validate gallery data
    const validImages = gallery.filter(image => {
      const isValid = image.src && image.alt;
      if (!isValid) {
        console.warn(`Skipping invalid gallery image: ${JSON.stringify(image)}`);
      }
      return isValid;
    });

    console.log(`Found ${validImages.length} valid gallery images to migrate`);

    // Use transaction for atomic migration
    await sql.begin(async (tx) => {
      // Insert each gallery image into the database
      for (let i = 0; i < validImages.length; i++) {
        const image = validImages[i];
        // Add order property if it doesn't exist
        const order = image.order || i + 1;
        
        await tx`
          INSERT INTO gallery (
            src, 
            alt, 
            order_position
          ) 
          VALUES (
            ${image.src}, 
            ${image.alt}, 
            ${order}
          )
        `;
        console.log(`Migrated gallery image: ${image.alt}`);
      }
    });
    
    console.log('Gallery migration completed successfully');
  } catch (error) {
    console.error('Error migrating gallery:', error);
    process.exit(1);
  } finally {
    // Close the connection
    await sql.close();
  }
}

migrateGallery();