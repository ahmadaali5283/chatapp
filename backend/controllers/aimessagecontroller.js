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
    const ragRes = await fetch(`${RAG_BASE}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        user_id: req.user._id.toString(),
        user_name: req.user.fullName,
      }),
    });

    const data = await ragRes.json();

    if (!ragRes.ok) {
      return res
        .status(ragRes.status)
        .json({ error: "RAG service error", details: data });
    }

    return res.status(200).json(data); // { answer, steps, memory_size }
  } catch (err) {
    console.error("askQuestion error:", err.message);
    return res
      .status(500)
      .json({ error: "Could not reach RAG service", details: err.message });
  }
};

/**
 * POST /api/ai/ingest
 * Triggers bulk-embedding of all MongoDB messages into ChromaDB.
 * No request body required.
 */
export const ingestMessages = async (req, res) => {
  try {
    const ragRes = await fetch(`${RAG_BASE}/ingest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await ragRes.json();

    if (!ragRes.ok) {
      return res
        .status(ragRes.status)
        .json({ error: "RAG service error", details: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("ingestMessages error:", err.message);
    return res
      .status(500)
      .json({ error: "Could not reach RAG service", details: err.message });
  }
};

/**
 * POST /api/ai/clear-memory
 * Clears the LangGraph per-user conversation memory for the
 * currently authenticated user.
 */
export const clearMemory = async (req, res) => {
  try {
    const ragRes = await fetch(`${RAG_BASE}/clear-memory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: req.user._id.toString() }),
    });

    const data = await ragRes.json();

    if (!ragRes.ok) {
      return res
        .status(ragRes.status)
        .json({ error: "RAG service error", details: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("clearMemory error:", err.message);
    return res
      .status(500)
      .json({ error: "Could not reach RAG service", details: err.message });
  }
};
