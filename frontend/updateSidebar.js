const fs = require('fs');
const content = import { Search, Sparkles, Moon, Sun } from "lucide-react";
import ConversationItem from "./ConversationItem";
import { SidebarSkeleton } from "../shared/Skeletons";
import { AI_ASSISTANT_ID } from "../../utils/chat";
import { useThemeStore } from "../../store/themeStore";

export default function Sidebar({
  conversations,
  activeConversation,
  loading,
  search,
  setSearch,
  onSelect,
}) {
  const { theme, toggleTheme } = useThemeStore();
  
  const filtered = conversations.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const aiEntry = filtered.find((item) => item.id === AI_ASSISTANT_ID);
  const humanEntries = filtered.filter((item) => item.id !== AI_ASSISTANT_ID);

  return (
    <aside className="h-full border-r border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 transition-colors">
      <div className="border-b flex justify-between items-center border-slate-300 dark:border-slate-800 px-4 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">GoChat</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">Workspace</p>
        </div>
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="p-3">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations"
            className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 py-2 pl-9 pr-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 transition-colors"
          />
        </label>
      </div>

      <div className="h-[calc(100%-150px)] overflow-y-auto px-2 pb-4">
        {loading ? (
          <SidebarSkeleton />
        ) : (
          <>
            <div className="space-y-1">
              {humanEntries.map((item) => (
                <ConversationItem
                  key={item.id}
                  item={item}
                  active={activeConversation?.id === item.id}
                  onClick={() => onSelect(item)}
                />
              ))}
            </div>

            {aiEntry && (
              <div className="mt-5 border-t border-slate-300 dark:border-slate-800 pt-4">
                <p className="mb-2 px-1 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
                  Assistant
                </p>
                <button
                  type="button"
                  onClick={() => onSelect(aiEntry)}
                  className={"flex w-full items-center gap-3 border px-3 py-2 text-left transition " + (
                    activeConversation?.id === aiEntry.id
                      ? "border-violet-400/70 bg-violet-100 dark:bg-violet-500/10"
                      : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 hover:border-slate-400 dark:hover:border-slate-500"
                  )}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 ring-1 ring-violet-200 dark:ring-violet-400/40">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Personal Assistant</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Context-aware AI helper</p>
                  </div>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
};
fs.writeFileSync('c:/Users/user/chatapp/frontend/src/components/sidebar/Sidebar.jsx', content);
