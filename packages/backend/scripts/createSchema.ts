import fs from 'fs/promises';
import path from 'path';
import sql from '../src/utils/db';

async function createSchema() {
  try {
    console.log('Creating database schema...');
    
    // Read schema SQL file
    const schemaPath = path.join(import.meta.dir, '../schema.sql');
    const schemaSql = await fs.readFile(schemaPath, 'utf-8');
    
    // Execute schema SQL using simple query mode for multiple statements
    await sql.unsafe(schemaSql).simple();
    
    console.log('Database schema created successfully');
  } catch (error) {
    console.error('Error creating database schema:', error);
    process.exit(1);
  } finally {
    // Close the connection
    await sql.close();
  }
}

createSchema();