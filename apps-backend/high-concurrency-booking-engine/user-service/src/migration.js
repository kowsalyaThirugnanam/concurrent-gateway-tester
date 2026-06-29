/**
 * migrate.js - Database Schema Initialization
 */
import pool from './db.js';

async function setupDatabase() {
  console.log('🔄 Starting database initialization...');
  try {
    // 1. Drop the table if it already exists to ensure a clean slate
    await pool.query(`DROP TABLE IF EXISTS users_test;`);
    
    // 2. Create the table structure WITHOUT any indexes on email or uuid
    await pool.query(`
      CREATE TABLE users_test (
        id SERIAL PRIMARY KEY,
        user_uuid VARCHAR(100) NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Table "users_test" created successfully (Unindexed).');
    process.exit(0);
  } catch (err) {
    console.error('❌ Database migration failed:', err.message);
    process.exit(1);
  }
}


setupDatabase();