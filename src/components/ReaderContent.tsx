"use client"

import { ReaderShell } from "./ReaderShell"
import { useSearchParams } from "next/navigation"
import { useRepoInfo } from "@/api/github/get-repo-info"
import { useRepoTree } from "@/api/github/get-tree"
import { useFileContent } from "@/api/github/get-file-content"
import dynamic from "next/dynamic"
import { ReaderSkeleton } from "./Skeletons"

// Dynamically import Reader with ssr disabled to keep initial client bundle light
const Reader = dynamic(() => import("./Reader").then(mod => mod.Reader), {
  loading: () => <ReaderSkeleton />,
  ssr: false,
})

export function ReaderContent({ owner, repo }: { owner: string; repo: string }) {
  const searchParams = useSearchParams()
  const filePath = searchParams.get("file") || undefined

  // Fetch repository details using the modular hook (TanStack useQuery)
  const { data: repoInfo, isLoading: isLoadingRepo, error: repoInfoError } = useRepoInfo(owner, repo)

  // Fetch the full directory tree using the modular hook (TanStack useQuery)
  const { data: treeData, isLoading: isLoadingTreeData, error: treeError } = useRepoTree(owner, repo)

  // Fetch the active file's content using the modular hook (TanStack useQuery)
  const { data: content, error: contentError, isFetching: isContentFetching } = useFileContent(owner, repo, filePath)

  const isLoadingTree = isLoadingRepo || isLoadingTreeData
  const hasError = repoInfoError || treeError

  if (hasError) {
    return (
      <div className="p-8 text-red-500 font-sans">
        Falha ao carregar o repositório. Verifique se o nome do proprietário e do repositório estão corretos e se o repositório é público. Se o problema persistir, tente novamente mais tarde. 😢
      </div>
    )
  }

  const tree = treeData?.tree || []
  const selectedSha = tree.find((i) => i.path === filePath)?.sha
  const branch = repoInfo?.default_branch || "main"

  return (
    <ReaderShell tree={tree} selectedSha={selectedSha} repoName={repo} isLoading={isLoadingTree}>
      <main className="flex flex-1 flex-col relative bg-background">
        {filePath ? (
          contentError ? (
            <div className="p-8 text-red-500 font-sans">
              Falha ao carregar o conteúdo do arquivo. Por favor, tente novamente. 😢
            </div>
          ) : isContentFetching || content === undefined ? (
            <ReaderSkeleton />
          ) : (
            <Reader 
              content={content} 
              fileName={filePath} 
              owner={owner} 
              repo={repo} 
              branch={branch} 
            />
          )
        ) : (
          <div className="flex flex-1 items-center justify-center text-zinc-400 bg-background text-sm font-medium tracking-wide font-sans">
            Selecione um arquivo no menu lateral para começar a leitura. 📚📂
          </div>
        )}
      </main>
    </ReaderShell>
  )
}