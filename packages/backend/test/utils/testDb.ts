import { SQL } from "bun";
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;

async function connectWithRetries(): Promise<SQL | undefined> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const sql = new SQL({
        url: process.env.POSTGRES_URL?.replace(/\/[^/]+$/, '/yelm_country_carvings_test'),
        tls: process.env.DB_SSL === 'true',
        connectionTimeout: 5 // Short timeout for quick failure
      });
      await sql`SELECT 1`; // Test the connection
      console.log('Test database connection successful');
      return sql;
    } catch (error) {
      console.warn(`Attempt ${attempt} to connect to test database failed:`, error);
      if (attempt < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      } else {
        console.error('Failed to connect to test database after multiple retries.');
        return undefined;
      }
    }
  }
  return undefined;
}

// Setup function to create test database and tables
export async function setupTestDb(): Promise<SQL> {
  const testSql = await connectWithRetries();
  if (!testSql) {
    throw Error('Database not available, skipping setup');
  }

  try {
    // Read schema SQL file
    const schemaPath = path.join(__dirname, '../../schema.sql');
    const schemaSql = await fs.readFile(schemaPath, 'utf-8');

    // Execute schema SQL
    await testSql.unsafe(schemaSql).simple();

    console.log('Test database schema created successfully');
    return testSql;
  } catch (error) {
    console.error('Error setting up test database:', error);
  }
}

// Teardown function to clean test tables
export async function teardownTestDb(testSql?: SQL) {
  if (!testSql) {
    console.warn('Database not available, skipping teardown');
    return;
  }

  try {
    await testSql.unsafe(`
      TRUNCATE TABLE events RESTART IDENTITY CASCADE;
      TRUNCATE TABLE gallery RESTART IDENTITY CASCADE;
    `).simple();
    console.log('Test database cleaned successfully');
  } catch (error) {
    console.error('Error cleaning test database:', error);
  }
}

// Close connection function for after tests
export async function closeTestDb(testSql?: SQL) {
  if (!testSql) {
    console.warn('Database not available, skipping close');
    return;
  }

  try {
    await testSql.close();
    console.log('Test database connection closed');
  } catch (error) {
    console.error('Error closing test database connection:', error);
  }
}
