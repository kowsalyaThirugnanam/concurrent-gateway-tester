/**
 * attack_unindexed.js - Native Concurrency Performance Benchmark
 * Using modern native Fetch API (Node.js v18+)
 */

const CONFIG = {
  TARGET_URL: 'http://localhost:5000/app/v1/search-email-without-index',
  TOTAL_CONCURRENT_REQUESTS: 300,
  TOTAL_ROWS_LIMIT: 100000,
  TIMEOUT_MS: 10000
};

async function executeBenchmarkRequest() {
  const randomUserIndex = Math.floor(Math.random() * CONFIG.TOTAL_ROWS_LIMIT);
  const email = `user_${randomUserIndex}@testbed.io`;
  
  // Construct a standard, safe URL with search parameters
  const url = new URL(CONFIG.TARGET_URL);
  url.searchParams.append('email', email);

  // Modern Native Timeout implementation using AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId); // Clean up the timer if the request finishes fast

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
    const data = await response.json();
    return { success: true, dbScanTime: data.database_scan_time_ms };
  } catch (error) {
    clearTimeout(timeoutId);
    return { success: false, error: error.name === 'AbortError' ? 'Timeout' : error.message };
  }
}

async function runConcurrencyAttack() {
  console.log(`\n🚀 [BENCHMARK] Initializing Native Load Test...`);
  console.time('⚡ Total Concurrency Execution Time');

  const taskQueue = Array.from({ length: CONFIG.TOTAL_CONCURRENT_REQUESTS }, () => executeBenchmarkRequest());
  const executionPool = await Promise.all(taskQueue);

  console.timeEnd('⚡ Total Concurrency Execution Time');

  const successfulRuns = executionPool.filter(req => req.success);
  const failedRuns = executionPool.filter(req => !req.success);

  console.log('\n📊 --- PERFORMANCE LOG REPORT ---');
  console.log(`✅ Completed Requests : ${successfulRuns.length}`);
  console.log(`❌ Dropped/Timed Out  : ${failedRuns.length}`);
  
  if (successfulRuns.length > 0) {
    console.log(`📝 Sample DB Execution Profiles:`, successfulRuns.slice(0, 20).map(run => run.dbScanTime));
  }
}

runConcurrencyAttack();