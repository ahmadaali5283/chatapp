export default function TypingIndicator({ visible }) {
  if (!visible) return null;

  return (
    <div className="inline-flex w-fit items-center gap-1 rounded-lg rounded-tl-none bg-white px-3 py-2 text-xs text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-400">
      <span>Typing</span>
      <span className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.25s] dark:bg-slate-500" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s] dark:bg-slate-500" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500" />
      </span>
    </div>
  );
}
