from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
import config
from agent import run_agent, clear_memory
from embedingsservice import embed_and_store

# ── FastAPI App ───────────────────────────────────────────────────────────
app = FastAPI(
    title="Chat RAG Agent API",
    description="Agentic RAG service for smart chat history assistant",
    version="1.0.0"
)

# ── CORS: Allow Express (Node.js) to call this service ───────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],  # your Express server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── MongoDB Connection ────────────────────────────────────────────────────
mongo_client = MongoClient(config.MONGO_URI)
db = mongo_client["chatapp"]
messages_collection = db["messages"]

# ── Request/Response Models ───────────────────────────────────────────────
class AskRequest(BaseModel):
    question: str
    user_id: str
    user_name: str

class AskResponse(BaseModel):
    answer: str
    steps: list
    memory_size: int

class ClearMemoryRequest(BaseModel):
    user_id: str


# ── Routes ────────────────────────────────────────────────────────────────

@app.get("/health")
def health_check():
    """Check if the Python RAG service is running"""
    return {"status": "ok", "service": "RAG Agent"}


@app.post("/ask", response_model=AskResponse)
async def ask(request: AskRequest):
    """
    Main endpoint — Express calls this with a question + user info.
    The agent reasons over chat history and returns an answer.
    """
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    if not request.user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")

    result = run_agent(
        question=request.question,
        user_id=request.user_id,
        user_name=request.user_name,
    )

    return AskResponse(
        answer=result["answer"],
        steps=result["steps"],
        memory_size=result.get("memory_size", 0),
    )


@app.post("/ingest")
async def ingest_all():
    """
    One-time endpoint — embeds ALL existing MongoDB messages into ChromaDB.
    Call this once after setting up the service.
    """
    try:
        # Step 1: Count total messages
        total = messages_collection.count_documents({})
        if total == 0:
            return {"message": "No messages found in MongoDB", "ingested": 0}

        # Step 3: Process in batches of 100
        batch_size = 100
        ingested = 0

        for skip in range(0, total, batch_size):
            # Fetch batch from MongoDB
            batch = list(
                messages_collection.find({})
                .skip(skip)
                .limit(batch_size)
            )

            # Convert ObjectId to string for each message
            for msg in batch:
                msg["_id"] = str(msg["_id"])
                if "senderId" in msg:
                    msg["senderId"] = str(msg["senderId"])
                if "recieverId" in msg:
                    msg["recieverId"] = str(msg["recieverId"])

            count = embed_and_store(batch)
            ingested += count
            print(f"Progress: {ingested}/{total} messages ingested...")

        return {
            "message": "Ingestion complete",
            "ingested": ingested,
            "total": total,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")

class IngestOneRequest(BaseModel):
    _id: str
    senderId: str
    recieverId: str
    text: str
    createdAt: str = ""


@app.post("/ingest-one")
async def ingest_one(request: IngestOneRequest):
    """
    Embeds a single message into ChromaDB right after it is saved.
    Called by the Express sendmessage controller on every new message.
    """
    try:
        msg = {
            "_id":       request._id,
            "senderId":  request.senderId,
            "recieverId":request.recieverId,
            "text":      request.text,
            "createdAt": request.createdAt,
        }
        count = embed_and_store([msg])
        return {"message": "Message embedded", "stored": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding failed: {str(e)}")


@app.post("/clear-memory")
async def clear_user_memory(request: ClearMemoryRequest):
    """
    Clears the conversation memory for a specific user.
    Call this from Express when user logs out.
    """
    clear_memory(request.user_id)
    return {"message": f"Memory cleared for user {request.user_id}"}
# ── Start Server ──────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=config.PORT,
        reload=True,   # auto-restarts when you edit files (dev mode)
    )
