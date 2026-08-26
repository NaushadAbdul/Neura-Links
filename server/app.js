import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/api.js';

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Ensure MongoDB Atlas is connected on every serverless request
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (e) {
    console.error('MongoDB Atlas Connection Error:', e);
  }
  next();
});

app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Neura Links Bots Club MongoDB Atlas Backend' });
});

export default app;
