import { Sparkles } from "lucide-react";

export default function AIInfoCard({ messageCount }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">AI Assistant</h3>
      <div className="space-y-3 border border-violet-500/30 bg-violet-500/5 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center bg-violet-600/20 text-violet-200">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-violet-100">Personal Assistant</p>
            <p className="text-[11px] text-violet-200/70">Powered by Claude</p>
          </div>
        </div>
        <p className="text-xs text-slate-300">
          Assistant has context from your previous conversations to provide summary, suggestions, and memory-aware help.
        </p>
        <div className="border-t border-violet-500/20 pt-3 text-xs text-violet-200/80">
          <p>AI thread messages: {messageCount}</p>
        </div>
      </div>
    </div>
  );
}
