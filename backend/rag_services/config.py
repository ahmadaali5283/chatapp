import os
from pathlib import Path
from dotenv import dotenv_values

# Use dotenv_values() — reads .env.rag into a dict WITHOUT setting os.environ.
# This prevents ChromaDB's pydantic-settings from seeing our vars in os.environ.
_env = dotenv_values(Path(__file__).parent / ".env.rag")

GROQ_API_KEY = _env.get("GROQ_API_KEY")
MONGO_URI = _env.get("MONGO_URI")
CHROMA_HOST = _env.get("CHROMA_HOST", "localhost")
CHROMA_PORT = int(_env.get("CHROMA_PORT", "8000"))
PORT = int(_env.get("PORT", "8001"))