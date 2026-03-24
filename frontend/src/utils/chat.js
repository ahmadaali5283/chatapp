export const AI_ASSISTANT_ID = "ai_assistant";

export function isAIAssistant(conversationId) {
  return conversationId === AI_ASSISTANT_ID || String(conversationId || "").startsWith("ai_");
}

export function normalizeConversation(raw) {
  const id = raw._id || raw.id || raw.conversationId;
  return {
    id,
    name: raw.fullName || raw.name || raw.title || raw.user?.fullName || "Unknown",
    avatarUrl: raw.profilePic || raw.avatarUrl || raw.user?.profilePic || "",
    lastMessage: raw.lastMessage?.text || raw.lastMessage || "",
    updatedAt: raw.updatedAt || raw.lastMessage?.createdAt || raw.createdAt || new Date().toISOString(),
    unreadCount: raw.unreadCount || 0,
    isOnline: Boolean(raw.isOnline),
    isGroup: Boolean(raw.isGroup),
  };
}

export function normalizeMessage(raw, fallbackConversationId) {
  const senderId = raw.senderId || raw.sender?._id || raw.sender || raw.userId || "";
  const receiverId = raw.receiverId || raw.receiver || raw.recieverId || "";

  return {
    id: raw._id || raw.id || `${Date.now()}_${Math.random()}`,
    conversationId:
      raw.conversationId ||
      raw.chatId ||
      fallbackConversationId ||
      receiverId ||
      senderId ||
      "",
    senderId,
    senderName: raw.senderName || raw.sender?.fullName || "",
    content: raw.content || raw.text || "",
    createdAt: raw.createdAt || new Date().toISOString(),
    status: raw.status || "sent",
    isAI: Boolean(raw.isAI),
  };
}

export function formatSidebarTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (sameDay) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function formatDateSeparator(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a, b) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  if (sameDay(date, today)) return "Today";
  if (sameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" });
}
