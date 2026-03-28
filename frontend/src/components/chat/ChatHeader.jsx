import { Search, Sun, Moon } from "lucide-react";
import Avatar from "../shared/Avatar";
import { useThemeStore } from "../../store/themeStore";

export default function ChatHeader({ conversation, isAI }) {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header
      className={`flex items-center justify-between px-4 py-3 transition-colors ${
        isAI
          ? "border-b border-indigo-500/30 bg-indigo-500/5 dark:border-indigo-500/30 dark:bg-indigo-500/5"
          : "border-b border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <Avatar name={conversation?.name} src={conversation?.avatarUrl} isAI={isAI} size="lg" />
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{conversation?.name || "Conversation"}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isAI ? "AI Assistant" : conversation?.isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-full p-2 text-slate-500 transition hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button type="button" className="rounded-full p-2 text-slate-500 transition hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700">
          <Search className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
