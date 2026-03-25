from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
import config
from tools import (
    search_messages,
    summarize_conversation,
    get_recent_messages,
    find_by_topic_and_user,
)
# ── LLM: ChatGroq ─────────────────────────────────────────────────────────
llm = ChatGroq(
    api_key=config.GROQ_API_KEY,
    model_name="llama-3.3-70b-versatile",   # fast + accurate free Groq model
    temperature=0.2,                         # lower = more factual, less creative
)
# ── Tools List ────────────────────────────────────────────────────────────
tools = [
    search_messages,
    summarize_conversation,
    get_recent_messages,
    find_by_topic_and_user,
]

# ── Per-User Memory via LangGraph MemorySaver ─────────────────────────────
# MemorySaver stores conversation state per thread_id (= user_id)
# Each user gets isolated memory — no bleed between users
checkpointer = MemorySaver()

# ── System Prompt ─────────────────────────────────────────────────────────
SYSTEM_PROMPT = """You are a smart, accurate, and helpful chat history assistant.
Your job is to help users find, recall and understand their past conversations.

Guidelines:
- Always use tools to fetch real data — never guess or fabricate messages
- If a tool returns no results, say so clearly — do not make up answers
- Use conversation history to resolve references like "that person" or "that chat"
- Be specific — include names, dates, and exact message content when available
- Always pass the user_id to tools that require it"""

# ── Create Agent (LangGraph) ──────────────────────────────────────────────
agent = create_react_agent(
    model=llm,
    tools=tools,
    checkpointer=checkpointer,       # enables per-thread (per-user) memory
    prompt=SYSTEM_PROMPT,             # system prompt injected into every call
)


# ── Main Function (called by main.py) ─────────────────────────────────────
def run_agent(question: str, user_id: str, user_name: str) -> dict:
    """
    Runs the full agentic RAG pipeline.

    Memory: thread_id = user_id
      - Same user_id across calls = agent remembers previous exchanges
      - Different user_id = completely isolated memory
    """
    try:
        # Each user gets their own memory thread via thread_id
        cfg = {"configurable": {"thread_id": user_id}}

        # Prepend user context so tools know who is asking
        full_question = (
            f"[Context: My name is {user_name}, my user_id is {user_id}]\n"
            f"{question}"
        )

        # Invoke the agent
        result = agent.invoke(
            {"messages": [HumanMessage(content=full_question)]},
            config=cfg,
        )

        # Extract the final answer (last AI message)
        messages = result["messages"]
        answer = ""
        for msg in reversed(messages):
            if isinstance(msg, AIMessage) and msg.content:
                answer = msg.content
                break

        # Extract tool calls (intermediate steps)
        steps = []
        for msg in messages:
            if isinstance(msg, ToolMessage):
                steps.append({
                    "tool": msg.name,
                    "result": str(msg.content)[:500],
                })

        return {
            "answer": answer,
            "steps": steps,
            "memory_size": len(messages),
        }

    except Exception as e:
        return {
            "answer": f"Agent failed: {str(e)}",
            "steps": [],
            "memory_size": 0,
        }


def clear_memory(user_id: str):
    """
    Clears conversation memory for a specific user.
    Called from main.py when user logs out.
    """
    storage = checkpointer.storage
    keys_to_delete = [k for k in storage if k[0] == user_id]
    for k in keys_to_delete:
        del storage[k]
