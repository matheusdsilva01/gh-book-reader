import { ReaderContent } from "@/components/ReaderContent"
import { Loader2 } from "lucide-react"
import { Suspense } from "react"

export default async function ReaderPage({ params }: PageProps<'/reader/[owner]/[repo]'>) {
  const { owner, repo } = await params

  return (
    <Suspense 
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <Loader2 className="animate-spin text-zinc-500" aria-label="Loading..." aria-busy="true" />
        </div>
      }
    >
      <ReaderContent owner={owner} repo={repo} />
    </Suspense>
  )
}
