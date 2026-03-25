# ChatApp With RAG Assistant

Real-time chat application built with React + Express + MongoDB, extended with a Python FastAPI Retrieval-Augmented Generation (RAG) service.

The app supports direct user-to-user messaging, authentication, media upload, and an AI assistant that can search and summarize historical conversations using vector search + LLM reasoning.

## What This Project Does

- Real-time-ish chat workflow with message persistence in MongoDB.
- JWT-based authentication with protected API routes.
- Image upload support through Cloudinary.
- Python RAG microservice for:
  - semantic search on chat history,
  - conversation summarization,
  - recent-message recall,
  - memory-aware AI answers per user session/thread.

## High-Level Architecture

1. React frontend calls Express API (`/api/*`) and sends auth token in headers/cookies.
2. Express stores and fetches messages from MongoDB.
3. On every new message, Express calls FastAPI `/ingest-one` to embed and index the message in ChromaDB.
4. For AI questions, frontend -> Express `/api/ai/ask` -> FastAPI `/ask`.
5. FastAPI agent (LangGraph + Groq) uses tools against MongoDB/Chroma and returns a grounded response.

## Tech Stack

- Frontend: React, Tailwind CSS, Axios, Zustand
- Node backend: Express, Mongoose, JWT, Cloudinary
- Python RAG service: FastAPI, LangChain/LangGraph, Groq, ChromaDB, HuggingFace embeddings, PyMongo
- Data: MongoDB + Chroma vector store

## Project Structure

- `frontend/`: React client
- `backend/`: Express API and auth/message routes
- `backend/rag_services/`: FastAPI RAG service (agent, embeddings, tools)

## Environment Variables

### Root `.env` (used by Express)

Create `chatapp/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
RAG_SERVICE_URL=http://localhost:8001

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### RAG `.env.rag` (used by FastAPI)

Create `backend/rag_services/.env.rag`:

```env
GROQ_API_KEY=your_groq_key
MONGO_URI=your_mongodb_uri
CHROMA_HOST=localhost
CHROMA_PORT=8000
PORT=8001
```

Important:

- Never commit `.env` or `.env.rag`.
- If a key was ever pushed, rotate it immediately.

## Local Setup

### 1. Clone and install Node dependencies

```bash
git clone https://github.com/ahmadaali5283/chatapp.git
cd chatapp
npm install
```

### 2. Start Express backend (port `5000`)

```bash
npm run dev
```

### 3. Start React frontend (port `3000`)

```bash
cd frontend
npm install
npm start
```

### 4. Start Python RAG API (port `8001`)

```bash
cd backend/rag_services
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

macOS/Linux:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirments.txt
```

Run API:

```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

Note: the file is currently named `requirments.txt` in this repository.

## API Endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/check`

### Messages

- `GET /api/messages/users`
- `GET /api/messages/:id`
- `POST /api/messages/send/:id`

### AI via Express (protected)

- `POST /api/ai/ask` -> forwards to FastAPI `/ask`
- `POST /api/ai/ingest` -> bulk embed existing messages
- `POST /api/ai/clear-memory` -> clear memory for logged-in user

### FastAPI RAG service

- `GET /health`
- `POST /ask`
- `POST /ingest`
- `POST /ingest-one`
- `POST /clear-memory`

## RAG Flow Details

1. Message saved in MongoDB by Express.
2. Express asynchronously calls FastAPI `/ingest-one`.
3. FastAPI embeds message text using `sentence-transformers/all-MiniLM-L6-v2`.
4. Embedding is stored in Chroma collection `chat_messages`.
5. For a user question, LangGraph agent uses tools to retrieve relevant records and answer with context.
6. Agent memory is isolated per `user_id` thread.

## Troubleshooting

- `Could not reach RAG service`
  - Ensure FastAPI is running on `http://localhost:8001`.
  - Ensure `RAG_SERVICE_URL` in root `.env` matches.

- No AI retrieval results
  - Call `POST /api/ai/ingest` once to index existing history.
  - Confirm Chroma server is reachable (`CHROMA_HOST`, `CHROMA_PORT`).

- Auth issues on frontend
  - Confirm `FRONTEND_URL` is set correctly in `.env`.
  - Confirm token is present in local storage after login.

## Security Notes

- Keep all secrets in local env files only.
- Do not commit `node_modules`, `.env`, `.env.rag`.
- Use GitHub secret scanning and push protection (already enabled on your repo).
