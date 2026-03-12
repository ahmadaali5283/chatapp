import express from "express";
import { protectRoute } from "../middlewares/authmiddleware.js";
import {
  askQuestion,
  ingestMessages,
  clearMemory,
} from "../controllers/aimessagecontroller.js";

const router = express.Router();

// POST /api/ai/ask          — send a question, receive an AI answer
router.post("/ask", protectRoute, askQuestion);

// POST /api/ai/ingest       — embed all MongoDB messages into ChromaDB
router.post("/ingest", protectRoute, ingestMessages);

// POST /api/ai/clear-memory — wipe conversation memory for the current user
router.post("/clear-memory", protectRoute, clearMemory);

export default router;
