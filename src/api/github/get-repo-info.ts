import { useQuery } from "@tanstack/react-query"
import { GitHubRepo } from "@/types/github"

const GITHUB_API_BASE = "https://api.github.com"

export async function fetchRepoInfo(owner: string, repo: string): Promise<GitHubRepo> {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch repo info: ${response.statusText}`)
  }
  return response.json()
}

export function useRepoInfo(owner: string, repo: string) {
  return useQuery({
    queryKey: ["repoInfo", owner, repo],
    queryFn: () => fetchRepoInfo(owner, repo),
    enabled: !!owner && !!repo,
  })
}
