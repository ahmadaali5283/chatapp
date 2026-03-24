import { formatDateSeparator } from "../../utils/chat";
import TypingIndicator from "./TypingIndicator";
import { MessagesSkeleton } from "../shared/Skeletons";

function statusMark(status) {
  if (status === "read") return "\u2713\u2713";
  if (status === "delivered") return "\u2713\u2713";
  return "\u2713";
}

export default function MessageList({
  messages,
  currentUserId,
  loading,
  typingVisible,
  showSenderName,
  endRef,
}) {
  if (loading) return <MessagesSkeleton />;

  let lastDate = "";

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 px-4 py-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        {messages.map((message) => {
          const mine = String(message.senderId) === String(currentUserId);
          const dateLabel = formatDateSeparator(message.createdAt);
          const showDate = dateLabel !== lastDate;
          if (showDate) {
            lastDate = dateLabel;
          }

          return (
            <div key={message.id}>
              {showDate && (
                <div className="my-2 text-center text-[11px] uppercase tracking-[0.12em] text-slate-500">
                  {dateLabel}
                </div>
              )}
              <div className={`group flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[78%] border px-3 py-2 text-sm transition ${
                    mine
                      ? "border-indigo-500/50 bg-indigo-600/20 text-indigo-100"
                      : "border-slate-700 bg-slate-900 text-slate-200"
                  }`}
                >
                  {showSenderName && !mine && message.senderName && (
                    <p className="mb-1 text-[11px] uppercase tracking-[0.08em] text-slate-400">
                      {message.senderName}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  <div className="mt-1 flex items-center justify-end gap-2 text-[11px] text-slate-500 opacity-0 transition group-hover:opacity-100">
                    <span>
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {mine && <span>{statusMark(message.status)}</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <TypingIndicator visible={typingVisible} />
        <div ref={endRef} />
      </div>
    </div>
  );
}
