import express from 'express';
import dotenv from 'dotenv';
import pool, { query } from './db.js';

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5001;

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Booking service is running smoothly.' });
});

app.listen(PORT, () => {
  console.log(`Booking service is running on port ${PORT}`);
});