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

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';
const clientOrigins = isProduction 
  ? [process.env.RENDER_EXTERNAL_URL, process.env.CLIENT_URL].filter(Boolean)
  : ["http://localhost:5173", "http://localhost:5174"];

if (clientOrigins.length === 0) {
  clientOrigins.push('https://syncspace-fbys.onrender.com');
}

const io = new Server(httpServer, {
  cors: {
    origin: clientOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['polling', 'websocket'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000
});

// Middleware
app.use(cors({
  origin: clientOrigins,
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the React app in production
if (isProduction) {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

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

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

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

// Catch-all handler: send back React's index.html file for any non-API routes
if (isProduction) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
