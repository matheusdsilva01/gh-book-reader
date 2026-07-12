"use client"

import useSWR from "swr"
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
  return useSWR(
    owner && repo ? ["tree", owner, repo] : null,
    () => fetchTree(owner, repo, "HEAD"),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 15 * 60 * 1000 // 15 minutes cache
    }
  )
}
