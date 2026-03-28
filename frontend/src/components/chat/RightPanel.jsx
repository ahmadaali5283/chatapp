import Avatar from "../shared/Avatar";
import AIInfoCard from "../ai/AIInfoCard";

export default function RightPanel({ conversation, isAI, messageCount }) {
  return (
    <aside className="hidden w-[280px] border-l border-slate-200 bg-slate-50 p-4 transition-colors xl:block dark:border-slate-800 dark:bg-slate-900/70">
      {isAI ? (
        <AIInfoCard messageCount={messageCount} />
      ) : (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">Profile</h3>
          <div className="space-y-3 border border-slate-200 bg-white p-4 transition-colors dark:border-slate-700 dark:bg-slate-950">
            <div className="flex items-center gap-3">
              <Avatar name={conversation?.name} src={conversation?.avatarUrl} size="lg" />
              <div>
                <p className="text-sm font-semibold text-slate-100">{conversation?.name || "Unknown"}</p>
                <p className="text-xs text-slate-400">{conversation?.isOnline ? "Online" : "Offline"}</p>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-3 text-xs text-slate-400">
              <p>Messages in this thread: {messageCount}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
