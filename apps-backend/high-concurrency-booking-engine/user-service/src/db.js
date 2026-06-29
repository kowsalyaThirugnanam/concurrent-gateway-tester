/**
 * This file sets up a connection pool to our PostgreSQL database(running in docker) using the 'pg' library.
 */
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Emulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the backend root .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Initialize the raw SQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of concurrent connections
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // Fail fast if Postgres takes over 2 seconds to respond
});

// Run a quick test query to ensure our credentials and connection work 
// This will log the current time from the Postgres server if successful, or an error message if it fails
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ PostgreSQL Connection Error:', err.message);
  } else {
    console.log('✅ PostgreSQL Connected Successfully at:', res.rows[0].now);
  }
});

export default pool;