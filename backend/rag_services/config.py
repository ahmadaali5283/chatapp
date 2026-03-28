import os
from pathlib import Path
from dotenv import dotenv_values

# Read local dev vars from .env.rag, while still allowing cloud env vars
# (Render/Railway/etc.) to override values at runtime.
_env = dotenv_values(Path(__file__).parent / ".env.rag")


def _get(name: str, default: str | None = None) -> str | None:
	return os.getenv(name) or _env.get(name) or default


GROQ_API_KEY = _get("GROQ_API_KEY")
MONGO_URI = _get("MONGO_URI")
CHROMA_HOST = _get("CHROMA_HOST", "localhost")
CHROMA_PORT = int(_get("CHROMA_PORT", "8000"))
PORT = int(_get("PORT", "8001"))

# Comma-separated origins for FastAPI CORS, e.g.
# ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
ALLOWED_ORIGINS = _get("ALLOWED_ORIGINS", "http://localhost:3000").split(",")