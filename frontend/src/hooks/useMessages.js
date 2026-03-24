import { useEffect, useMemo, useRef } from "react";
import { useChatStore } from "../store/chatStore";

export function useMessages() {
  const endRef = useRef(null);
  const activeConversation = useChatStore((s) => s.activeConversation);
  const messagesByConversation = useChatStore((s) => s.messagesByConversation);

  const messages = useMemo(() => {
    if (!activeConversation?.id) return [];
    return messagesByConversation[activeConversation.id] || [];
  }, [activeConversation?.id, messagesByConversation]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, activeConversation?.id]);

  return { messages, endRef };
}
