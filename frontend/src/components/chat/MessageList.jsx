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
    <div className="relative flex-1 overflow-y-auto bg-slate-100 px-4 py-4 transition-colors dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-wa-pattern bg-repeat opacity-5"></div>
      <div className="mx-auto flex max-w-3xl flex-col gap-3 relative z-10">
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
                  className={`max-w-[78%] px-3 py-2 text-sm shadow-sm transition-colors ${
                    mine
                      ? "rounded-lg rounded-tr-none bg-indigo-50 text-slate-900 dark:bg-indigo-600 dark:text-slate-100"
                      : "rounded-lg rounded-tl-none bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                >
                  {showSenderName && !mine && message.senderName && (
                    <p className="mb-1 text-[11px] uppercase tracking-[0.08em] text-slate-400">
                      {message.senderName}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  <div className="mt-1 flex items-center justify-end gap-2 text-[11px] text-slate-500 dark:text-slate-400">
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
