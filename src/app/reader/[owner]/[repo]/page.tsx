import { ReaderShell } from "@/components/ReaderShell"
import { Reader } from "@/components/Reader"
import { fetchRepoInfo, fetchTree, fetchBlobContent } from "@/lib/github"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

async function ReaderContent({ owner, repo, filePath }: { owner: string; repo: string; filePath?: string }) {
  let data
  try {
    const repoInfo = await fetchRepoInfo(owner, repo)
    const treeData = await fetchTree(owner, repo, repoInfo.default_branch)
    const tree = treeData.tree

    let content = ""
    if (filePath) {
      const fileItem = tree.find((item) => item.path === filePath)
      if (fileItem) {
        content = await fetchBlobContent(owner, repo, fileItem.sha)
      }
    }

    const selectedSha = tree.find((i) => i.path === filePath)?.sha
    data = { tree, content, selectedSha, branch: repoInfo.default_branch }
  } catch {
    return <div className="p-8 text-red-500">
      Falha ao carregar o repositório. Verifique se o nome do proprietário e do repositório estão corretos e se o repositório é público. Se o problema persistir, tente novamente mais tarde. 😢
    </div>
  }

  const { tree, content, selectedSha, branch } = data

  return (
    <ReaderShell tree={tree} selectedSha={selectedSha} repoName={repo}>
      <main className="flex flex-1 flex-col overflow-hidden relative bg-background">
        {filePath ? (
          <Reader content={content} fileName={filePath} owner={owner} repo={repo} branch={branch} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-zinc-400 bg-background text-sm font-medium tracking-wide">
            Selecione um arquivo no menu lateral para começar a leitura. 📚📂
          </div>
        )}
      </main>
    </ReaderShell>
  )
}

type Props = {
  searchParams: Promise<{ file?: string }>
} & PageProps<'/reader/[owner]/[repo]'>

export default async function ReaderPage({ params, searchParams }: Props) {
  const { owner, repo } = await params
  const { file: filePath } = await searchParams

  return (
    <Suspense 
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <Loader2 className="animate-spin text-zinc-500" aria-label="Loading..." aria-busy="true" />
        </div>
      }
    >
      <ReaderContent owner={owner} repo={repo} filePath={filePath} />
    </Suspense>
  )
}
