import { SQL } from "bun";

// Create a SQL instance using environment variables
// Bun automatically uses POSTGRES_URL or DATABASE_URL if available
const sql = new SQL({
  // Connection can be configured via environment variables or explicitly here
  url: process.env.POSTGRES_URL,
  
  // Optional configuration
  max: 20, // Maximum connections in pool
  idleTimeout: 30, // Close idle connections after 30s
  connectionTimeout: 30, // Connection timeout in seconds
  
  // Optional SSL configuration
  tls: process.env.DB_SSL === 'true',
  
  // Optional BigInt support
  bigint: true,
  
  // Connection callbacks
  onconnect: () => {
    console.log('Database connected successfully');
  },
  onclose: () => {
    console.log('Database connection closed');
  }
});

// Test the connection
try {
  const [{ now }] = await sql`SELECT NOW() as now`;
  console.log('Database connected successfully at', now);
} catch (error) {
  console.error('Error connecting to database:', error);
}

export default sql;