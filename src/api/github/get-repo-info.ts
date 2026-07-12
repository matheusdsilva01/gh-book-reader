"use client"

import useSWR from "swr"
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
  return useSWR(
    owner && repo ? ["repoInfo", owner, repo] : null,
    () => fetchRepoInfo(owner, repo),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 15 * 60 * 1000 // 15 minutes cache
    }
  )
}
