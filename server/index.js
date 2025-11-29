const express = require('express'); // Server entry point
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const authRoutes = require('./src/routes/authRoutes');
const teamRoutes = require('./src/routes/teamRoutes');
const workspaceRoutes = require('./src/routes/workspaceRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const fileRoutes = require('./src/routes/fileRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const documentRoutes = require('./src/routes/documentRoutes');
const favoriteRoutes = require('./src/routes/favoriteRoutes');

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"]
  },
  transports: ['polling', 'websocket'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000
});

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Attach Socket.IO to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Database Connection
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/favorites', favoriteRoutes);

app.get('/', (req, res) => {
  res.send('SyncSpace API is running');
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('setup', (userData) => {
    if (userData && userData._id) {
      socket.join(userData._id);
      socket.emit('connected');
    }
  });

  socket.on('join-workspace', (workspaceId) => {
    socket.join(workspaceId);
    console.log(`User ${socket.id} joined workspace ${workspaceId}`);
    socket.to(workspaceId).emit('user-online', { socketId: socket.id });
  });

  socket.on('user-online', (userId) => {
    socket.join(userId);
    io.emit('user-status', { userId, status: 'online' });
  });

  socket.on('task-updated', (data) => {
    const { workspaceId } = data;
    socket.to(workspaceId).emit('task-updated', data);
  });

  // Yjs Collaboration
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined Y.js room ${room}`);
  });

  socket.on('yjs-update', ({ room, update }) => {
    socket.to(room).emit('yjs-update', update);
  });

  socket.on('yjs-sync-request', ({ room }) => {
    socket.to(room).emit('yjs-sync-request', { requestorId: socket.id });
  });

  socket.on('yjs-sync-response', ({ room, update, targetId }) => {
    io.to(targetId).emit('yjs-update', update);
  });

  // Error handling
  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });

  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', socket.id, 'Reason:', reason);
  });

  socket.on('yjs-awareness', ({ room, update }) => {
    socket.to(room).emit('yjs-awareness', { update });
  });

  // Chat typing indicators
  socket.on('typing-start', ({ room, userId, userName }) => {
    socket.to(room).emit('user-typing', { userId, userName });
  });

  socket.on('typing-stop', ({ room, userId }) => {
    socket.to(room).emit('user-stopped-typing', { userId });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
