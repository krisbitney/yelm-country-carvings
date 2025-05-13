import { SQL } from "bun";
import fs from 'fs/promises';
import path from 'path';

// Setup function to create test database and tables
export async function setupTestDb(): Promise<SQL> {
  const sql = new SQL({
    url: process.env.POSTGRES_URL,
    tls: process.env.DB_SSL === 'true',
    connectionTimeout: 5,
  });
  await sql.connect();
  console.log('Test database connection successful');

  try {
    // Read schema SQL file
    const schemaPath = path.join(__dirname, '../../schema.sql');
    const schemaSql = await fs.readFile(schemaPath, 'utf-8');

    // Execute schema SQL
    await sql.unsafe(schemaSql).simple();
    console.log('Test database schema created successfully');

    return sql;
  } catch (error) {
    console.error('Error setting up test database:', error);
  }
}

// Teardown function to clean test tables
export async function teardownTestDb(testSql: SQL) {
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
export async function closeTestDb(testSql: SQL) {
  try {
    await testSql.close();
    console.log('Test database connection closed');
  } catch (error) {
    console.error('Error closing test database connection:', error);
  }
}
