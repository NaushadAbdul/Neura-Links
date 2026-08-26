import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Attach socket.io instance to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Mount API routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Neura Links Bots Club MongoDB Atlas Backend' });
});

// Socket.io event listeners
io.on('connection', (socket) => {
  console.log(`🔌 Client connected to Real-Time Sync: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

// Connect Database and start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 NEURA LINKS MongoDB Atlas Server running on http://localhost:${PORT}`);
  });
});
