import { useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { toast } from "react-hot-toast";
import Sidebar from "../components/sidebar/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import RightPanel from "../components/chat/RightPanel";
import EmptyState from "../components/chat/EmptyState";
import { useChatStore } from "../store/chatStore";
import { useMessages } from "../hooks/useMessages";
import { useSocket } from "../hooks/useSocket";
import api from "../services/api";
import { AI_ASSISTANT_ID, isAIAssistant, normalizeMessage } from "../utils/chat";

export default function Chat() {
  useSocket();

  const currentUser = useChatStore((s) => s.currentUser);
  const conversations = useChatStore((s) => s.conversations);
  const activeConversation = useChatStore((s) => s.activeConversation);
  const loadingConversations = useChatStore((s) => s.loadingConversations);
  const loadingMessages = useChatStore((s) => s.loadingMessages);
  const typingByConversation = useChatStore((s) => s.typingByConversation);
  const fetchConversations = useChatStore((s) => s.fetchConversations);
  const setActiveConversation = useChatStore((s) => s.setActiveConversation);
  const appendMessage = useChatStore((s) => s.appendMessage);
  const mobileSidebarOpen = useChatStore((s) => s.mobileSidebarOpen);
  const setMobileSidebarOpen = useChatStore((s) => s.setMobileSidebarOpen);
  const clearAuth = useChatStore((s) => s.clearAuth);

  const [search, setSearch] = useState("");
  const [aiThinking, setAiThinking] = useState(false);

  const { messages, endRef } = useMessages();

  useEffect(() => {
    fetchConversations().catch((error) => {
      toast.error(error.message);
    });
  }, [fetchConversations]);

  useEffect(() => {
    if (!activeConversation && conversations.length) {
      const firstHuman = conversations.find((item) => item.id !== AI_ASSISTANT_ID) || conversations[0];
      setActiveConversation(firstHuman);
    }
  }, [activeConversation, conversations, setActiveConversation]);

  const isAI = useMemo(() => isAIAssistant(activeConversation?.id), [activeConversation?.id]);
  const typingVisible = Boolean(typingByConversation[activeConversation?.id]);

  const sendTyping = (isTyping) => {
    if (!activeConversation || isAI) return;
    window.__chat_socket?.emit(isTyping ? "typing:start" : "typing:stop", {
      conversationId: activeConversation.id,
    });
  };

  const handleSend = async (content) => {
    if (!activeConversation) return;

    if (isAI) {
      const userMessage = normalizeMessage(
        {
          id: `tmp_${Date.now()}`,
          conversationId: activeConversation.id,
          senderId: currentUser?.id || currentUser?._id,
          content,
          createdAt: new Date().toISOString(),
          status: "read",
        },
        activeConversation.id
      );
      appendMessage(userMessage, activeConversation.id);
      setAiThinking(true);

      try {
        const res = await api.post("/api/ai/ask", {
          question: content,
        });

        appendMessage(
          normalizeMessage(
            {
              id: `ai_${Date.now()}`,
              conversationId: activeConversation.id,
              senderId: AI_ASSISTANT_ID,
              content: res.data?.message || res.data?.answer || "No response",
              createdAt: new Date().toISOString(),
              isAI: true,
            },
            activeConversation.id
          ),
          activeConversation.id
        );
      } catch (error) {
        toast.error(error.message);
      } finally {
        setAiThinking(false);
      }

      return;
    }

    const socket = window.__chat_socket;

    try {
      const res = await api.post(`/api/messages/send/${activeConversation.id}`, { text: content });
      const normalized = normalizeMessage(res.data, activeConversation.id);
      appendMessage(normalized, activeConversation.id);
      socket?.emit("message:send", {
        ...normalized,
        conversationId: activeConversation.id,
      });
    } catch (primaryError) {
      try {
        const res = await api.post("/api/messages/send", {
          conversationId: activeConversation.id,
          message: content,
        });
        const normalized = normalizeMessage(res.data, activeConversation.id);
        appendMessage(normalized, activeConversation.id);
        socket?.emit("message:send", {
          ...normalized,
          conversationId: activeConversation.id,
        });
      } catch (fallbackError) {
        toast.error(fallbackError.message || primaryError.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      // Logout should continue client-side even if endpoint fails.
    }
    clearAuth();
  };

  return (
    <main className="h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="flex h-full">
        <div
          className={`fixed inset-y-0 left-0 z-30 w-[260px] transform transition lg:static lg:translate-x-0 ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            conversations={conversations}
            activeConversation={activeConversation}
            loading={loadingConversations}
            search={search}
            setSearch={setSearch}
            onSelect={setActiveConversation}
          />
        </div>

        {mobileSidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-slate-950/60 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        )}

        <section className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-3 py-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="border border-slate-700 p-2"
            >
              {mobileSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="border border-slate-700 px-3 py-1 text-xs text-slate-300"
            >
              Logout
            </button>
          </div>

          {activeConversation ? (
            <>
              <ChatHeader conversation={activeConversation} isAI={isAI} />
              <MessageList
                messages={messages}
                currentUserId={currentUser?.id || currentUser?._id}
                loading={loadingMessages}
                typingVisible={typingVisible || aiThinking}
                showSenderName={Boolean(activeConversation?.isGroup)}
                endRef={endRef}
              />
              <MessageInput onSend={handleSend} disabled={!activeConversation} onTyping={sendTyping} />
              {isAI && (
                <p className="border-t border-violet-500/20 bg-violet-500/5 px-4 py-2 text-xs text-violet-200/80">
                  Your assistant has context of your conversations
                </p>
              )}
            </>
          ) : (
            <EmptyState />
          )}
        </section>

        <RightPanel conversation={activeConversation} isAI={isAI} messageCount={messages.length} />
      </div>
    </main>
  );
}
