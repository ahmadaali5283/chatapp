import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load .env from repo root (local dev) or fall back to Railway env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import authroutes from './routes/auth.js';
import Messagesroutes from './routes/messageroute.js';
import aiRoutes from './routes/airoute.js';
import { connectdb } from './lib/db.js';

const app = express();
const server = http.createServer(app);

// Support multiple allowed origins (comma-separated in FRONTEND_URL env var)
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// ── CORS ─────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, mobile apps, same-origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// ── Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authroutes);
app.use("/api/messages", Messagesroutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("ConnectChat API is running");
});

// ── Socket.IO ────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: frontendOrigin,
    credentials: true,
  },
});

// Track online users: userId → socketId
const onlineUsers = new Map();

// Socket.IO auth middleware — extract userId from JWT cookie
io.use((socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.cookie
        ?.split(';')
        .find((c) => c.trim().startsWith('jwt='))
        ?.split('=')[1];

    if (!token || token === 'chat-cookie-auth') {
      // Allow connection without auth for cookie-based sessions
      return next();
    }

    const secret = process.env.JWT_SECRET || process.env.JWT_KEY;
    const decoded = jwt.verify(token, secret);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    // Still allow connection — userId will be set via "user:join"
    next();
  }
});

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // ── User comes online ──────────────────────────────────────────────
  socket.on('user:join', (userId) => {
    if (!userId) return;
    socket.userId = userId;
    onlineUsers.set(userId, socket.id);
    console.log(`✅ ${userId} is online (${onlineUsers.size} total)`);

    // Broadcast to all other clients
    socket.broadcast.emit('user:online', { userId });

    // Send current online users list to the newly connected user
    socket.emit('users:online', Array.from(onlineUsers.keys()));
  });

  // ── Message relay ──────────────────────────────────────────────────
  socket.on('message:send', (payload) => {
    const { conversationId, senderId, ...rest } = payload;
    const receiverSocketId = onlineUsers.get(conversationId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('message:receive', {
        ...rest,
        senderId,
        conversationId: senderId, // For receiver, conversation = sender
      });

      // Send delivery receipt back to sender
      io.to(receiverSocketId).emit('message:delivered', {
        messageId: payload.id,
        conversationId,
      });
    }
  });

  // ── Typing indicators ─────────────────────────────────────────────
  socket.on('typing:start', ({ conversationId }) => {
    const receiverSocketId = onlineUsers.get(conversationId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user:typing', {
        conversationId: socket.userId,
        isTyping: true,
        userId: socket.userId,
      });
    }
  });

  socket.on('typing:stop', ({ conversationId }) => {
    const receiverSocketId = onlineUsers.get(conversationId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user:typing', {
        conversationId: socket.userId,
        isTyping: false,
        userId: socket.userId,
      });
    }
  });

  // ── Read receipts ─────────────────────────────────────────────────
  socket.on('message:read', ({ conversationId }) => {
    const receiverSocketId = onlineUsers.get(conversationId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('message:read', {
        conversationId: socket.userId,
      });
    }
  });

  // ── Disconnect ────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      console.log(`❌ ${socket.userId} disconnected (${onlineUsers.size} online)`);
      socket.broadcast.emit('user:offline', { userId: socket.userId });
    }
  });
});

// Make io accessible from routes if needed
app.set('io', io);
app.set('onlineUsers', onlineUsers);

// ── Start Server ─────────────────────────────────────────────────────────
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`✅ ConnectChat server running on port ${port}`);
  connectdb();
});
