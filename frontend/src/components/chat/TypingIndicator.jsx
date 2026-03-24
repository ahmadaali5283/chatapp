export default function TypingIndicator({ visible }) {
  if (!visible) return null;

  return (
    <div className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300">
      <span>Typing</span>
      <span className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.25s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300" />
      </span>
    </div>
  );
}
