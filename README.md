# ChatApp — AI-Powered Real-Time Chat Application

A full-stack chat application with an **AI-powered RAG (Retrieval-Augmented Generation)** assistant that helps users search, recall, and understand their past conversations using natural language.

## Features

- **Real-time Messaging** — Send text and image messages between users
- **AI Chat Assistant** — Ask questions about your chat history in plain English
- **Semantic Search** — Find messages by meaning using vector embeddings (ChromaDB)
- **Conversation Summarization** — Get AI-generated summaries of past conversations
- **Per-User Memory** — AI maintains isolated context per user session
- **Authentication** — Secure signup/login with hashed passwords and JWT
- **Image Uploads** — Share images via Cloudinary integration
- **Profile Management** — Update profile picture

## Tech Stack

### Frontend

- React 19 with React Router v7
- Tailwind CSS
- React Hot Toast (notifications)

### Backend

- Node.js + Express 5
- MongoDB with Mongoose
- JWT Authentication (cookie-based)
- Cloudinary (image uploads)

### AI / RAG Pipeline

- **LLM**: Groq — LLaMA 3.3 70B Versatile
- **Agent Framework**: LangGraph (ReAct agent)
- **Orchestration**: LangChain
- **Embeddings**: HuggingFace `all-MiniLM-L6-v2`
- **Vector Store**: ChromaDB
- **Memory**: LangGraph MemorySaver (per-user checkpointing)

## Project Structure

```
chatapp/
├── backend/
│   ├── index.js                 # Express server entry point
│   ├── controllers/
│   │   ├── authcontrollers.js   # Signup, login, logout, profile update
│   │   ├── messagecontroller.js # Send/receive messages, sidebar users
│   │   └── aimessagecontroller.js # Proxy to Python RAG service
│   ├── models/
│   │   ├── users.js             # User schema (email, name, password, pic)
│   │   └── message.js           # Message schema (sender, receiver, text, image)
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── messageroute.js      # Messaging routes
│   │   └── airoute.js           # AI assistant routes
│   ├── middlewares/
│   │   └── authmiddleware.js    # JWT verification middleware
│   ├── lib/
│   │   ├── db.js                # MongoDB connection
│   │   ├── cloudinary.js        # Cloudinary config
│   │   └── utils.js             # JWT utility helpers
│   └── rag_services/            # Python AI agent service
│       ├── main.py              # FastAPI server (port 8001)
│       ├── agent.py             # LangGraph ReAct agent with tools
│       ├── tools.py             # RAG tools (search, summarize, recent)
│       ├── embedingsservice.py  # ChromaDB embedding pipeline
│       ├── config.py            # Environment config loader
│       └── requirments.txt      # Python dependencies
├── frontend/
│   ├── public/
│   └── src/
│       └── App.js               # React application
├── package.json
└── .gitignore
```

## API Endpoints

### Authentication

| Method | Route                      | Description            |
| ------ | -------------------------- | ---------------------- |
| POST   | `/api/auth/signup`         | Register new user      |
| POST   | `/api/auth/login`          | Login                  |
| POST   | `/api/auth/logout`         | Logout (clear JWT)     |
| PUT    | `/api/auth/update-profile` | Update profile picture |
| GET    | `/api/auth/check`          | Verify auth status     |

### Messaging

| Method | Route                    | Description                  |
| ------ | ------------------------ | ---------------------------- |
| GET    | `/api/messages/users`    | Get sidebar user list        |
| GET    | `/api/messages/:id`      | Get conversation with a user |
| POST   | `/api/messages/send/:id` | Send a message               |

### AI Assistant

| Method | Route                  | Description                  |
| ------ | ---------------------- | ---------------------------- |
| POST   | `/api/ai/ask`          | Ask AI about chat history    |
| POST   | `/api/ai/ingest`       | Embed messages into ChromaDB |
| POST   | `/api/ai/clear-memory` | Clear user's AI memory       |

### RAG Service (FastAPI — port 8001)

| Method | Route           | Description               |
| ------ | --------------- | ------------------------- |
| GET    | `/health`       | Health check              |
| POST   | `/ask`          | Query RAG agent           |
| POST   | `/ingest`       | Batch-embed messages      |
| POST   | `/clear-memory` | Clear conversation memory |

## Getting Started

### Prerequisites

- Node.js v18+
- Python 3.10+
- MongoDB instance
- ChromaDB server
- Groq API key
- Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/ahmadaali5283/chatapp.git
cd chatapp
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Install Python RAG dependencies

```bash
cd backend/rag_services
pip install -r requirments.txt
cd ../..
```

### 5. Configure environment variables

Create `.env` in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAG_SERVICE_URL=http://localhost:8001
NODE_ENV=development
```

Create `.env.rag` in `backend/rag_services/`:

```env
GROQ_API_KEY=your_groq_api_key
MONGO_URI=your_mongodb_connection_string
CHROMA_HOST=localhost
CHROMA_PORT=8000
PORT=8001
```

### 6. Run the application

```bash
# Terminal 1 — Start ChromaDB
chroma run --host localhost --port 8000

# Terminal 2 — Start backend server
npm run dev

# Terminal 3 — Start RAG service
cd backend/rag_services
python main.py

# Terminal 4 — Start frontend
cd frontend
npm start
```

The app will be available at `http://localhost:3000`.

## License

MIT
