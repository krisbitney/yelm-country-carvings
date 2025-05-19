import fs from 'fs/promises';
import path from 'path';
import sql from '../src/utils/db';
import { MarketEvent } from '../src/types';

const DATA_DIR = path.join(__dirname, '../data');
const EVENTS_FILE_PATH = path.join(DATA_DIR, 'events.json');

async function migrateEvents() {
  try {
    // Read events from JSON file
    const data = await fs.readFile(EVENTS_FILE_PATH, 'utf-8');
    const events: MarketEvent[] = JSON.parse(data);

    console.log(`Migrating ${events.length} events to database...`);

    // Validate events data
    const validEvents = events.filter(event => {
      const isValid = event.title && event.location && event.description && event.image;
      if (!isValid) {
        console.warn(`Skipping invalid event: ${JSON.stringify(event)}`);
      }
      return isValid;
    });

    console.log(`Found ${validEvents.length} valid events to migrate`);

    // Use transaction for atomic migration
    await sql.begin(async (tx) => {
      // Insert each event into the database
      for (const event of validEvents) {
        await tx`
          INSERT INTO events (
            title, 
            location, 
            description, 
            image, 
            start_date, 
            end_date
          ) 
          VALUES (
            ${event.title}, 
            ${event.location}, 
            ${event.description}, 
            ${event.image}, 
            ${event.startDate}, 
            ${event.endDate}
          )
        `;
        console.log(`Migrated event: ${event.title}`);
      }
    });
    
    console.log('Events migration completed successfully');
  } catch (error) {
    console.error('Error migrating events:', error);
    process.exit(1);
  } finally {
    // Close the connection
    await sql.close();
  }
}

migrateEvents();