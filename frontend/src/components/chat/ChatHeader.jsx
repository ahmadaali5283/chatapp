import { Info, Search } from "lucide-react";
import Avatar from "../shared/Avatar";

export default function ChatHeader({ conversation, isAI }) {
  return (
    <header
      className={`flex items-center justify-between border-b px-4 py-3 ${
        isAI ? "border-violet-500/30 bg-violet-500/5" : "border-slate-800 bg-slate-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <Avatar name={conversation?.name} src={conversation?.avatarUrl} isAI={isAI} size="lg" />
        <div>
          <p className="text-sm font-semibold text-slate-100">{conversation?.name || "Conversation"}</p>
          <p className="text-xs text-slate-400">
            {isAI ? "AI Assistant" : conversation?.isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" className="border border-slate-700 p-2 text-slate-400 hover:text-slate-200">
          <Search className="h-4 w-4" />
        </button>
        <button type="button" className="border border-slate-700 p-2 text-slate-400 hover:text-slate-200">
          <Info className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
