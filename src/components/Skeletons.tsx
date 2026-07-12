import { cn } from "@/lib/utils"

export function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-4 w-20 bg-zinc-200 rounded mb-2" />
      <div className="h-3 w-40 bg-zinc-100 rounded mb-8" />

      {/* Directory items skeletons */}
      <div className="flex flex-col gap-4">
        {[...Array(12)].map((_, idx) => (
          <div key={idx} className="flex items-center gap-3" style={{ paddingLeft: `${(idx % 3) * 12}px` }}>
            <div className="h-4 w-4 bg-zinc-200 rounded-sm" />
            <div 
              className={cn(
                "h-3 bg-zinc-200 rounded",
                idx % 3 === 0 ? "w-28" : idx % 3 === 1 ? "w-36" : "w-24"
              )} 
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ReaderSkeleton() {
  return (
    <div className="flex-1 bg-background p-6 py-12 md:p-24 animate-pulse">
      <div className="mx-auto max-w-2xl">
        <header className="mb-12 md:mb-16 border-b border-sidebar-border/50 pb-8 md:pb-10">
          <div className="h-3 w-12 bg-zinc-200 rounded mb-4" />
          <div className="h-8 w-64 bg-zinc-200 rounded" />
        </header>
        <article className="flex flex-col gap-4">
          <div className="h-4 w-full bg-zinc-200 rounded" />
          <div className="h-4 w-[95%] bg-zinc-200 rounded" />
          <div className="h-4 w-[98%] bg-zinc-200 rounded" />
          <div className="h-4 w-[90%] bg-zinc-200 rounded" />
          
          <div className="h-4 w-[60%] bg-zinc-200 rounded mt-4" />
          
          <div className="h-4 w-full bg-zinc-200 rounded mt-4" />
          <div className="h-4 w-[97%] bg-zinc-200 rounded" />
          <div className="h-4 w-[92%] bg-zinc-200 rounded" />
        </article>
      </div>
    </div>
  )
}
