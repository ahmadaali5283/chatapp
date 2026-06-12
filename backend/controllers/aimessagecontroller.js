import axios from 'axios';

const RAG_BASE = process.env.RAG_SERVICE_URL || "http://localhost:8001";

/**
 * POST /api/ai/ask
 * Body: { question: string }
 * Forwards the question to the Python RAG /ask endpoint together with
 * the authenticated user's id and name so the agent can personalise
 * its response and maintain per-user memory.
 */
export const askQuestion = async (req, res) => {
  const { question } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({ error: "question is required" });
  }

  try {
    const ragRes = await axios.post(`${RAG_BASE}/ask`, {
      question,
      user_id: req.user._id.toString(),
      user_name: req.user.fullName,
    }, { timeout: 30000 }); // 30s timeout

    return res.status(200).json(ragRes.data); // { answer, steps, memory_size }
  } catch (err) {
    console.error("askQuestion error:", err.message);
    const status = err.response?.status || 500;
    const details = err.response?.data || err.message;
    return res.status(status).json({ error: "Could not reach RAG service", details });
  }
};

/**
 * POST /api/ai/ingest
 * Triggers bulk-embedding of all MongoDB messages into ChromaDB.
 * No request body required.
 */
export const ingestMessages = async (req, res) => {
  try {
    const ragRes = await axios.post(`${RAG_BASE}/ingest`, {}, { timeout: 30000 });
    return res.status(200).json(ragRes.data);
  } catch (err) {
    console.error("ingestMessages error:", err.message);
    const status = err.response?.status || 500;
    const details = err.response?.data || err.message;
    return res.status(status).json({ error: "Could not reach RAG service", details });
  }
};

/**
 * POST /api/ai/clear-memory
 * Clears the LangGraph per-user conversation memory for the
 * currently authenticated user.
 */
export const clearMemory = async (req, res) => {
  try {
    const ragRes = await axios.post(`${RAG_BASE}/clear-memory`, {
      user_id: req.user._id.toString()
    }, { timeout: 15000 });

    return res.status(200).json(ragRes.data);
  } catch (err) {
    console.error("clearMemory error:", err.message);
    const status = err.response?.status || 500;
    const details = err.response?.data || err.message;
    return res.status(status).json({ error: "Could not reach RAG service", details });
  }
};
