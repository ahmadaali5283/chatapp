from langchain_core.tools import tool
from pymongo import MongoClient
from bson import ObjectId
import config
from embedingsservice import get_vectorstore
# ── MongoDB Connection ────────────────────────────────────────────────────
client = MongoClient(config.MONGO_URI)
db = client["chatapp"]
messages_collection = db["messages"]
users_collection = db["users"]

# ── Helper: Find User By Name ─────────────────────────────────────────────
def find_user_by_name(name: str):
    """Find a user in MongoDB by fullName field (case insensitive)"""
    user = users_collection.find_one(
        {"fullName": {"$regex": name, "$options": "i"}}
    )
    return user


# ── Tool 1: Semantic Search ───────────────────────────────────────────────
@tool
def search_messages(query: str) -> str:
    """
    Semantically search through all chat messages using a topic or keyword.
    Use this when the user asks about a general topic or keyword in their chats.
    Input: a natural language query or topic.
    """
    try:
        vectorstore = get_vectorstore()
        results = vectorstore.similarity_search(query, k=8)

        if not results:
            return "No relevant messages found."

        output = []
        for i, doc in enumerate(results):
            m = doc.metadata
            output.append(
                f"[{i+1}] Message: '{doc.page_content}' | "
                f"From: {m.get('sender_id')} → To: {m.get('receiver_id')} | "
                f"At: {m.get('timestamp')}"
            )
        return "\n".join(output)

    except Exception as e:
        return f"Search failed: {str(e)}"


# ── Tool 2: Summarize Conversation ───────────────────────────────────────
@tool
def summarize_conversation(user_id: str, other_user_name: str) -> str:
    """
    Fetches the full conversation between the current user and another person.
    Use this when the user asks to summarize or review a full chat with someone.
    Input: current user MongoDB ID and the other person's fullName.
    """
    try:
        other_user = find_user_by_name(other_user_name)
        if not other_user:
            return f"User named '{other_user_name}' not found in database."

        other_id = other_user["_id"]

        messages = list(
            messages_collection.find(
                {
                    "$or": [
                        {
                            "senderId": ObjectId(user_id),
                            "recieverId": other_id
                        },
                        {
                            "senderId": other_id,
                            "recieverId": ObjectId(user_id)
                        },
                    ]
                }
            )
            .sort("createdAt", 1)
            .limit(100)
        )

        if not messages:
            return f"No conversation found between you and {other_user_name}."

        transcript = []
        for msg in messages:
            who = "You" if str(msg["senderId"]) == user_id else other_user_name
            text = msg.get("text", "")
            transcript.append(f"{who}: {text}")

        header = f"Conversation with {other_user_name} ({len(messages)} messages):\n"
        return header + "\n".join(transcript)

    except Exception as e:
        return f"Summarize failed: {str(e)}"


# ── Tool 3: Get Recent Messages ───────────────────────────────────────────
@tool
def get_recent_messages(user_id: str, other_user_name: str, limit: int = 10) -> str:
    """
    Gets the most recent messages between the current user and another person.
    Use this when the user asks what was said recently or last week with someone.
    Input: current user MongoDB ID, the other person's fullName, optional limit.
    """
    try:
        other_user = find_user_by_name(other_user_name)
        if not other_user:
            return f"User named '{other_user_name}' not found in database."

        other_id = other_user["_id"]

        messages = list(
            messages_collection.find(
                {
                    "$or": [
                        {
                            "senderId": ObjectId(user_id),
                            "recieverId": other_id
                        },
                        {
                            "senderId": other_id,
                            "recieverId": ObjectId(user_id)
                        },
                    ]
                }
            )
            .sort("createdAt", -1)
            .limit(limit)
        )

        if not messages:
            return "No recent messages found."

        # Reverse to show oldest first
        messages.reverse()

        output = []
        for msg in messages:
            who = "You" if str(msg["senderId"]) == user_id else other_user_name
            date = str(msg.get("createdAt", ""))
            text = msg.get("text", "")
            output.append(f"{who}: {text} ({date})")

        return "\n".join(output)

    except Exception as e:
        return f"Recent messages failed: {str(e)}"


# ── Tool 4: Find Messages By Topic And User ───────────────────────────────
@tool
def find_by_topic_and_user(topic: str, sender_name: str = "") -> str:
    """
    Finds messages about a specific topic, optionally filtered by who sent them.
    Use this when the user asks what a specific person said about a specific subject.
    Input: topic to search for, and optionally the sender's fullName.
    """
    try:
        vectorstore = get_vectorstore()
        results = vectorstore.similarity_search(topic, k=10)

        if not results:
            return f"No messages found about '{topic}'."

        # Filter by sender if name provided
        if sender_name:
            sender = find_user_by_name(sender_name)
            if sender:
                sender_id = str(sender["_id"])
                results = [
                    doc for doc in results
                    if doc.metadata.get("sender_id") == sender_id
                ]

        if not results:
            return f"No messages about '{topic}' from '{sender_name}' found."

        output = []
        for i, doc in enumerate(results):
            output.append(
                f"[{i+1}] '{doc.page_content}' — "
                f"sent on {doc.metadata.get('timestamp')}"
            )

        return "\n".join(output)

    except Exception as e:
        return f"Topic search failed: {str(e)}"