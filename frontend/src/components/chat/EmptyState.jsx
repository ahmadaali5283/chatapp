import { MessageSquare } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <div className="flex h-14 w-14 items-center justify-center border border-slate-700 bg-slate-900 text-slate-400">
        <MessageSquare className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-slate-200">Select a conversation to start chatting</h3>
      <p className="max-w-sm text-sm text-slate-400">
        Choose a person from the sidebar or use Personal Assistant for AI-supported conversation help.
      </p>
    </div>
  );
}
