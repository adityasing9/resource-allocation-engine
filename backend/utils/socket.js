/**
 * Socket.io Configuration
 *
 * Handles real-time notifications:
 * - 'task:assigned'   → Notify volunteer when assigned a task
 * - 'task:completed'  → Notify admin when a task is completed
 * - 'notification'    → Generic notification event
 *
 * Users join a room named after their userId on connect.
 */

let io = null;

/**
 * Initialize Socket.io with the HTTP server
 */
function initSocket(server) {
  const { Server } = require('socket.io');

  io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // User joins a personal room using their userId
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`👤 User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

/**
 * Get the Socket.io instance (call after initSocket)
 */
function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initSocket first.');
  }
  return io;
}

/**
 * Send a notification to a specific user
 */
function notifyUser(userId, event, data) {
  if (io) {
    io.to(userId.toString()).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Broadcast to all connected clients
 */
function broadcast(event, data) {
  if (io) {
    io.emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = { initSocket, getIO, notifyUser, broadcast };
