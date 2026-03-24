import { create } from "zustand";
import api from "../services/api";
import {
  AI_ASSISTANT_ID,
  isAIAssistant,
  normalizeConversation,
  normalizeMessage,
} from "../utils/chat";

function aiConversation(currentUser) {
  return {
    id: AI_ASSISTANT_ID,
    name: "Personal Assistant",
    avatarUrl: "",
    lastMessage: "Ask anything about your conversations",
    updatedAt: new Date().toISOString(),
    unreadCount: 0,
    isOnline: true,
    isGroup: false,
    isAI: true,
    conversationId: `ai_${currentUser?.id || currentUser?._id || "user"}`,
  };
}

export const useChatStore = create((set, get) => ({
  token: localStorage.getItem("chat_token") || "",
  currentUser: JSON.parse(localStorage.getItem("chat_user") || "null"),
  activeConversation: null,
  conversations: [],
  messagesByConversation: {},
  loadingConversations: false,
  loadingMessages: false,
  onlineUsers: [],
  typingByConversation: {},
  mobileSidebarOpen: false,

  setAuth: ({ token, user }) => {
    localStorage.setItem("chat_token", token);
    localStorage.setItem("chat_user", JSON.stringify(user));
    set({ token, currentUser: user });
  },

  clearAuth: () => {
    localStorage.removeItem("chat_token");
    localStorage.removeItem("chat_user");
    set({
      token: "",
      currentUser: null,
      activeConversation: null,
      conversations: [],
      messagesByConversation: {},
      typingByConversation: {},
      onlineUsers: [],
    });
  },

  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

  fetchConversations: async () => {
    set({ loadingConversations: true });
    try {
      let data = [];
      try {
        const res = await api.get("/api/messages/users");
        data = res.data || [];
      } catch (error) {
        const fallback = await api.get("/api/users/conversations");
        data = (fallback.data || []).map((item) => ({
          ...item,
          id: item._id,
          name: item.fullName,
          lastMessage: "",
        }));
      }

      const list = data.map(normalizeConversation);
      const me = get().currentUser;
      set({ conversations: [...list, aiConversation(me)] });
    } finally {
      set({ loadingConversations: false });
    }
  },

  setActiveConversation: async (conversation) => {
    set({ activeConversation: conversation, mobileSidebarOpen: false });

    if (!conversation?.id) return;

    set((state) => ({
      conversations: state.conversations.map((item) =>
        item.id === conversation.id ? { ...item, unreadCount: 0 } : item
      ),
    }));

    if (!isAIAssistant(conversation.id)) {
      const socket = window.__chat_socket;
      socket?.emit("message:read", { conversationId: conversation.id });
    }

    await get().fetchMessages(conversation.id);
  },

  fetchMessages: async (conversationId) => {
    if (!conversationId || isAIAssistant(conversationId)) {
      return;
    }

    set({ loadingMessages: true });
    try {
      const res = await api.get(`/api/messages/${conversationId}`);
      const normalized = (res.data || []).map((m) => normalizeMessage(m, conversationId));
      set((state) => ({
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: normalized,
        },
      }));
    } finally {
      set({ loadingMessages: false });
    }
  },

  appendMessage: (incoming, conversationId) => {
    const normalized = normalizeMessage(incoming, conversationId);
    const current = get().activeConversation;

    set((state) => {
      const prevMessages = state.messagesByConversation[normalized.conversationId] || [];
      const alreadyExists = prevMessages.some((m) => m.id === normalized.id);
      if (alreadyExists) return state;

      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [normalized.conversationId]: [...prevMessages, normalized],
        },
        conversations: state.conversations.map((item) => {
          if (item.id !== normalized.conversationId) return item;
          return {
            ...item,
            lastMessage: normalized.content,
            updatedAt: normalized.createdAt,
            unreadCount: current?.id === normalized.conversationId ? 0 : (item.unreadCount || 0) + 1,
          };
        }),
      };
    });
  },

  updateOnlineStatus: ({ userId, online }) => {
    set((state) => {
      const pool = new Set(state.onlineUsers);
      if (online) pool.add(userId);
      if (!online) pool.delete(userId);

      return {
        onlineUsers: [...pool],
        conversations: state.conversations.map((item) =>
          item.id === userId ? { ...item, isOnline: online } : item
        ),
      };
    });
  },

  setTyping: ({ conversationId, isTyping, userId }) => {
    set((state) => ({
      typingByConversation: {
        ...state.typingByConversation,
        [conversationId]: isTyping ? userId : "",
      },
    }));
  },

  updateMessageStatus: ({ messageId, status, conversationId }) => {
    if (!conversationId || !messageId) return;
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: (state.messagesByConversation[conversationId] || []).map((m) =>
          m.id === messageId ? { ...m, status } : m
        ),
      },
    }));
  },
}));
