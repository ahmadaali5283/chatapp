# Chat Application with AI RAG Service

A full-stack, real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js), Socket.io, and a dedicated AI RAG (Retrieval-Augmented Generation) microservice built in Python (FastAPI).

## Features

- **User Authentication**: Secure signup and login using JWT.
- **Real-Time Messaging**: Websocket-powered instant messaging using Socket.io.
- **AI RAG Assistant**: A dedicated Python backend running a Retrieval-Augmented Generation service providing smart context-aware conversational capabilities based on user history.
- **Modern UI**: Fully responsive user interface built with React, Tailwind CSS, and Zustand for state management.
- **Media Support**: Image uploads managed via Cloudinary.

## Tech Stack

- **Frontend**: React 19, Zustand, Tailwind CSS, Axios, Socket.io-client
- **Backend (Node.js)**: Express.js, MongoDB (Mongoose), Socket.io, JWT, Cloudinary
- **AI Microservice (Python)**: FastAPI, Uvicorn, PyMongo

## Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- MongoDB connection string
- Cloudinary credentials

## Installation and Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd chatapp
```

### 2. Node.js Backend Setup (Port 5000)
```bash
cd backend
npm install
npm run dev
```
*Create a `.env` file in the backend directory with your `PORT`, `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`, and Cloudinary keys.*

### 3. React Frontend Setup (Port 3000)
```bash
cd frontend
npm install
npm start
```

### 4. Python RAG Service Setup (Port 5001)
```bash
cd backend/rag_services
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Mac/Linux:
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --port 5001 --reload
```

## Running the Application
Ensure all three services (Frontend, Node.js Backend, and Python API) are running simultaneously to utilize full functionality. 
- Access the frontend app at `http://localhost:3000`.
- The Node API runs at `http://localhost:5000`.
- The RAG API runs at `http://localhost:5001`.

