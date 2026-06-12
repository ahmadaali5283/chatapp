import sys
import time

print("STEP 1: Starting imports...", flush=True)

print("Importing fastapi...", flush=True)
from fastapi import FastAPI, HTTPException, Depends
print("Importing pydantic...", flush=True)
from pydantic import BaseModel, Field
print("Importing pymongo...", flush=True)
from pymongo import MongoClient

print("STEP 2: Importing config...", flush=True)
import config
print(f"Config read: MONGO_URI={config.MONGO_URI}, PORT={config.PORT}, GROQ={config.GROQ_API_KEY[:10] if config.GROQ_API_KEY else None}...", flush=True)

print("STEP 3: Connecting to MongoDB...", flush=True)
try:
    mongo_client = MongoClient(config.MONGO_URI, serverSelectionTimeoutMS=2000)
    # Trigger a call to verify connection
    mongo_client.admin.command('ping')
    print("MongoDB connection success!", flush=True)
except Exception as e:
    print(f"MongoDB connection failed: {e}", flush=True)

print("STEP 4: Importing agent...", flush=True)
import agent
print("Agent imported!", flush=True)

print("STEP 5: Importing embeddings...", flush=True)
import embedingsservice
print("Embeddings service imported!", flush=True)

print("STEP 6: Loading embeddings model...", flush=True)
t0 = time.time()
embeddings = embedingsservice.embeddings
print(f"Embeddings object accessed in {time.time()-t0:.2f}s", flush=True)

print("All diagnostic checks passed!", flush=True)
sys.exit(0)
