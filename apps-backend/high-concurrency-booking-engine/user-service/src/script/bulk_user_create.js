/**
 * seed.js - High-Volume Mock Data Generation (Production-Standard)
 */
import pool from '../db.js';
import format from 'pg-format'; // Industry standard bulk formatter

async function bulkUserCreate() {
  console.log('🌱 Starting database seeding (100,000 rows using pg-format)...');
  console.time('⏱️ Seeding Duration');

  try {
    const batchSize = 10000;
    const totalRows = 100000;
    const totalBatches = totalRows / batchSize;

    const roles = ['admin', 'developer', 'user', 'manager', 'guest'];

    for (let b = 0; b < totalBatches; b++) {
      const batchRows = [];

      for (let i = 0; i < batchSize; i++) {
        const index = b * batchSize + i;
        const uuid = `usr_${Math.random().toString(36).substr(2, 9)}_${index}`;
        const name = `MockUser_${index}`;
        const email = `user_${index}@testbed.io`;
        const role = roles[index % roles.length];

        // Standard Practice: Clean 2D array structure (Row -> Columns)
        batchRows.push([uuid, name, email, role]);
      }

      // Safe bulk insertion using literal placeholder (%L)
      const queryText = format(
        'INSERT INTO users_test (user_uuid, name, email, role) VALUES %L', 
        batchRows
      );

      // Execute the formatted query
      await pool.query(queryText);
      console.log(`▓ Progress: Batch ${b + 1}/${totalBatches} inserted successfully.`);
    }

    console.log('\n✅ Database seeding completed successfully.');
    console.timeEnd('⏱️ Seeding Duration');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

bulkUserCreate();