"use client"

import { fetchRepoInfo, fetchTree, fetchFileContentByPath } from "@/lib/github"
import { ReaderShell } from "./ReaderShell"
import { useSearchParams } from "next/navigation"
import useSWR from "swr"
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

  // Fetch repository details (like default_branch)
  const { data: repoInfo, error: repoInfoError } = useSWR(
    owner && repo ? ["repoInfo", owner, repo] : null,
    () => fetchRepoInfo(owner, repo),
    { revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 60 * 1000 * 15 }
  )

  // Fetch the full directory tree using "HEAD"
  const { data: treeData, error: treeError } = useSWR(
    owner && repo ? ["tree", owner, repo] : null,
    () => fetchTree(owner, repo, "HEAD"),
    { revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 60 * 1000 * 15 }
  )

  const isContentAvailable = owner && repo && filePath
  // Fetch the active file's content
  const { data: content, error: contentError, isValidating: isContentValidating } =
    useSWR(
      isContentAvailable ? ["content", owner, repo, filePath] : null,
      () => fetchFileContentByPath(owner, repo, filePath!),
      { revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 60 * 1000 * 15 }
  )

  const isLoadingTree = !treeData && !treeError
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
          ) : isContentValidating || content === undefined ? (
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