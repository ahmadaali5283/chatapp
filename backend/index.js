import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
import authroutes from './routes/auth.js';
import Messagesroutes from './routes/messageroute.js';
import aiRoutes from './routes/airoute.js';
import { connectdb } from './lib/db.js';

const app = express();
// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser());
// Correct route usage — add leading slash "/"
app.use("/api/auth", authroutes);
app.use("/api/messages", Messagesroutes);
app.use("/api/ai", aiRoutes);
// Basic test route
app.get("/", (req, res) => {
  res.send("Hello from the server!");
});
// Use correct environment variable name (must match .env)
const port = process.env.PORT || 5000;
// Start server and connect to DB
app.listen(port, () => {
  console.log(`✅ App running on port ${port}`);
  connectdb();
});
