export function SidebarSkeleton() {
  return (
    <div className="space-y-3 p-2">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="animate-pulse rounded-lg border border-slate-700 bg-slate-800/60 p-3">
          <div className="mb-2 h-3 w-2/3 rounded bg-slate-700" />
          <div className="h-2 w-1/2 rounded bg-slate-700" />
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
          className={`animate-pulse rounded-md border border-slate-700 bg-slate-800/70 p-3 ${
            idx % 2 ? "ml-auto w-[70%]" : "w-[60%]"
          }`}
        />
      ))}
    </div>
  );
}
