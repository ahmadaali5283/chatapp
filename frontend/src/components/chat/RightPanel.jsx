import Avatar from "../shared/Avatar";
import AIInfoCard from "../ai/AIInfoCard";

export default function RightPanel({ conversation, isAI, messageCount }) {
  return (
    <aside className="hidden w-[280px] border-l border-slate-800 bg-slate-900/70 p-4 xl:block">
      {isAI ? (
        <AIInfoCard messageCount={messageCount} />
      ) : (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">Profile</h3>
          <div className="space-y-3 border border-slate-700 bg-slate-950 p-4">
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
