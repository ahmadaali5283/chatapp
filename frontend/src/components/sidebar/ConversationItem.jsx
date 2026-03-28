import Avatar from "../shared/Avatar";
import { formatSidebarTime } from "../../utils/chat";

export default function ConversationItem({ item, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full border-b border-slate-200 p-3 text-left transition-colors dark:border-slate-800/50 ${
        active
          ? "bg-slate-100 dark:bg-slate-700"
          : "bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/50"
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar name={item.name} src={item.avatarUrl} isAI={item.isAI} />       
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{item.name}</p>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{formatSidebarTime(item.updatedAt)}</span>
          </div>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{item.lastMessage || "No messages yet"}</p>
        </div>
        {!!item.unreadCount && (
          <span className="rounded-full bg-indigo-500 px-2 py-0.5 text-[11px] font-semibold text-white">
            {item.unreadCount}
          </span>
        )}
      </div>
    </button>
  );
}
