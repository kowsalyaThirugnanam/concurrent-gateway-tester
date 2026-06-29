/**
 * This file sets up an Express server that serves as the API Gateway for our application.
 */
import express from 'express';
import Redis from 'ioredis';
import { Queue } from 'bullmq'; // Imports BullMQ to handle background task queues
import dotenv from 'dotenv';
import pool from './db.js'; // Imports db.js and runs the Postgres test query
import searchEmailWithoutIndexRoute from './routes/search_email_without_index.js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Initialize Redis client using .env variables
const redisClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null // Required compatibility setting for BullMQ
});

redisClient.on('connect', () => {
  console.log('✅ Redis Connected Successfully');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Connection Error:', err.message);
});

// Initialize BullMQ queue- high-concurrency background job queue
const loadTestQueue = new Queue('load-test-queue', {
  connection: redisClient
});
console.log('📦 BullMQ "load-test-queue" initialized successfully');

// Base route to verify the gateway endpoint is alive
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', gateway: 'Concurrent-Gateway-Tester' });
});

// search api without index route
app.use('/app/v1/search-email-without-index', searchEmailWithoutIndexRoute(app));

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running natively on port ${PORT}`);
});