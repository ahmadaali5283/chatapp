export default function Avatar({ name, src, isAI = false, size = "md" }) {
  const initials = (name || "?")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizeClass = size === "lg" ? "h-11 w-11" : "h-9 w-9";

  if (isAI) {
    return (
      <div
        className={`${sizeClass} flex items-center justify-center rounded-md bg-violet-600/20 text-sm font-semibold text-violet-300 ring-1 ring-violet-500/40`}
      >
        AI
      </div>
    );
  }

  if (src) {
    return <img src={src} alt={name} className={`${sizeClass} rounded-md object-cover`} />;
  }

  return (
    <div
      className={`${sizeClass} flex items-center justify-center rounded-md bg-slate-700 text-xs font-semibold text-slate-200 ring-1 ring-slate-600`}
    >
      {initials}
    </div>
  );
}
