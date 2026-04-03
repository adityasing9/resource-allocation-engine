/**
 * Server Entry Point
 *
 * Sets up Express, MongoDB, Socket.io, and mounts all API routes.
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const { initSocket } = require('./utils/socket');

const app = express();
const server = http.createServer(app);

// ─── Middleware ────────────────────────────────────────
app.use(cors({
  origin: function (origin, callback) {
    // Dynamically reflect origin to bypass strict Safari/Firefox CORS loops for local dev
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Connect to MongoDB ──────────────────────────────
connectDB();

// ─── Initialize Socket.io ────────────────────────────
initSocket(server);

// ─── API Routes ──────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/assign', require('./routes/assign'));

// ─── Health Check ────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Error Handling Middleware ────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// ─── Start Server ────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🔌 Socket.io ready`);
});
