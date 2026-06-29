/** Database connection setup */
import { Pool }  from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Emulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the backend root .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // High-concurrency tuning knobs
  max: 20,                  // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to sit idle before being closed
  connectionTimeoutMillis: 2000, // Return an error if a connection takes too long
});

// Test connection on startup
pool.on('connect', () => {
  console.log('🔌 Connected to the Booking Database Pool');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database pool error:', err);
});

// Quick health check on startup
(async () => {
  try {
    const result = await pool.query('SELECT 1');
    console.log('✅ Database health check passed:', result.rows[0]);
  } catch (err) {
    console.error('❌ Database health check failed:', err.message);
  }
})();

export const query = (text, params) => pool.query(text, params);
export default pool;