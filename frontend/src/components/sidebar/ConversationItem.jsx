import Avatar from "../shared/Avatar";
import { formatSidebarTime } from "../../utils/chat";

export default function ConversationItem({ item, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full border px-3 py-2 text-left transition ${
        active
          ? "border-indigo-500/70 bg-indigo-500/10"
          : "border-slate-700 bg-slate-900 hover:border-slate-500"
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar name={item.name} src={item.avatarUrl} isAI={item.isAI} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium text-slate-100">{item.name}</p>
            <span className="text-[11px] text-slate-400">{formatSidebarTime(item.updatedAt)}</span>
          </div>
          <p className="truncate text-xs text-slate-400">{item.lastMessage || "No messages yet"}</p>
        </div>
        {!!item.unreadCount && (
          <span className="rounded-full bg-violet-500 px-2 py-0.5 text-[11px] font-semibold text-white">
            {item.unreadCount}
          </span>
        )}
      </div>
    </button>
  );
}
