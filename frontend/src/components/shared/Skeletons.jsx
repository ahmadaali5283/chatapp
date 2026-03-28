export function SidebarSkeleton() {
  return (
    <div className="space-y-3 p-2">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="animate-pulse rounded-lg border border-slate-200 bg-slate-100 p-3 dark:border-slate-700 dark:bg-slate-800/60">
          <div className="mb-2 h-3 w-2/3 rounded bg-slate-300 dark:bg-slate-700" />
          <div className="h-2 w-1/2 rounded bg-slate-300 dark:bg-slate-700" />
        </div>
      ))}
    </div>
  );
}

export function MessagesSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 7 }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse rounded-md border border-slate-200 bg-slate-100 p-3 dark:border-slate-700 dark:bg-slate-800/70 ${
            idx % 2 ? "ml-auto w-[70%]" : "w-[60%]"
          }`}
        />
      ))}
    </div>
  );
}
