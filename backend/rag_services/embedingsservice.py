import chromadb
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
import config

# Initialize HuggingFace Embedding Model
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)
def get_vectorstore():
    """
    Connects to ChromaDB server and returns the vectorstore
    """
    client = chromadb.HttpClient(
        host=config.CHROMA_HOST,
        port=config.CHROMA_PORT,
    )

    vectorstore = Chroma(
        client=client,
        collection_name="chat_messages",
        embedding_function=embeddings,
    )
    return vectorstore


def embed_and_store(messages: list):
    """
    Takes a list of MongoDB message dicts
    Converts them to Documents and stores in ChromaDB
    """
    vectorstore = get_vectorstore()
    documents = []
    ids = []

    for msg in messages:
        # Get text safely
        text = msg.get("text") or msg.get("message", "")
        
        # Skip empty messages
        if not text or not text.strip():
            continue

        # Build metadata for filtering later
        metadata = {
            "sender_id":   str(msg.get("senderId", "")),
            "receiver_id": str(msg.get("recieverId", "")),
            "timestamp":   str(msg.get("createdAt", ""))
        }

        # Create LangChain Document
        doc = Document(page_content=text, metadata=metadata)
        documents.append(doc)

        # Use MongoDB _id as vector ID to prevent duplicates
        ids.append(str(msg.get("_id")))

    if documents:
        vectorstore.add_documents(documents=documents, ids=ids)
        print(f"✅ Embedded and stored {len(documents)} messages.")

    return len(documents)