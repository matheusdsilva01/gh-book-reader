import { useQuery } from "@tanstack/react-query"
import { GitHubTree } from "@/types/github"

const GITHUB_API_BASE = "https://api.github.com"

export async function fetchTree(owner: string, repo: string, sha: string): Promise<GitHubTree> {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${sha}?recursive=1`)
  if (!response.ok) {
    throw new Error(`Failed to fetch tree: ${response.statusText}`)
  }
  return response.json()
}

export function useRepoTree(owner: string, repo: string) {
  return useQuery({
    queryKey: ["tree", owner, repo],
    queryFn: () => fetchTree(owner, repo, "HEAD"),
    enabled: !!owner && !!repo,
  })
}
