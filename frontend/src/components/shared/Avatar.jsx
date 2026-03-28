export default function Avatar({ name, src, isAI = false, size = "md" }) {
  const initials = (name || "?")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizeClass = size === "xl" ? "h-40 w-40 text-4xl" : size === "lg" ? "h-11 w-11 text-base" : "h-9 w-9 text-xs";

  if (isAI) {
    return (
      <div
        className={`${sizeClass} flex items-center justify-center rounded-full bg-indigo-500/10 text-sm font-semibold text-indigo-600 ring-1 ring-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-400`}
      >
        AI
      </div>
    );
  }

  if (src) {
    return <img src={src} alt={name} className={`${sizeClass} rounded-full object-cover`} />;
  }

  return (
    <div
      className={`${sizeClass} flex items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600 ring-1 ring-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:ring-slate-600`}
    >
      {initials}
    </div>
  );
}
