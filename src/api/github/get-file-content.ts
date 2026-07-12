"use client"

import useSWR from "swr"

const GITHUB_API_BASE = "https://api.github.com"

export async function fetchFileContentByPath(owner: string, repo: string, path: string): Promise<string> {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`)
  const data = await response.json()
  if (!response.ok) {
    throw new Error(`Failed to fetch file content: ${response.statusText}`)
  }
  return Buffer.from(data.content, 'base64').toString() // Decode base64 content
}

export function useFileContent(owner: string, repo: string, filePath?: string) {
  return useSWR(
    owner && repo && filePath ? ["content", owner, repo, filePath] : null,
    () => fetchFileContentByPath(owner, repo, filePath!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 15 * 60 * 1000 // 15 minutes cache
    }
  )
}
