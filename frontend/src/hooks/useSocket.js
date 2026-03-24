import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "../services/socket";
import { useChatStore } from "../store/chatStore";

export function useSocket() {
  const token = useChatStore((s) => s.token);
  const appendMessage = useChatStore((s) => s.appendMessage);
  const setTyping = useChatStore((s) => s.setTyping);
  const updateOnlineStatus = useChatStore((s) => s.updateOnlineStatus);
  const updateMessageStatus = useChatStore((s) => s.updateMessageStatus);

  useEffect(() => {
    if (!token) return undefined;

    const socket = connectSocket(token);
    if (!socket) {
      window.__chat_socket = null;
      return undefined;
    }

    window.__chat_socket = socket;

    socket.on("message:receive", (payload) => {
      appendMessage(payload, payload.conversationId);
    });

    socket.on("user:typing", (payload) => {
      setTyping({
        conversationId: payload.conversationId,
        isTyping: payload.isTyping,
        userId: payload.userId,
      });
    });

    socket.on("user:online", ({ userId }) => {
      updateOnlineStatus({ userId, online: true });
    });

    socket.on("user:offline", ({ userId }) => {
      updateOnlineStatus({ userId, online: false });
    });

    socket.on("message:delivered", (payload) => {
      updateMessageStatus({
        messageId: payload.messageId,
        status: "delivered",
        conversationId: payload.conversationId,
      });
    });

    socket.on("message:read", (payload) => {
      updateMessageStatus({
        messageId: payload.messageId,
        status: "read",
        conversationId: payload.conversationId,
      });
    });

    return () => {
      socket.removeAllListeners();
      disconnectSocket();
      window.__chat_socket = null;
    };
  }, [appendMessage, setTyping, token, updateMessageStatus, updateOnlineStatus]);
}
