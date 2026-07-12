import { useQuery } from "@tanstack/react-query"

const GITHUB_API_BASE = "https://api.github.com"

export async function fetchFileContentByPath(owner: string, repo: string, path: string): Promise<string> {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`, {
    headers: {
      "Accept": "application/vnd.github.raw",
    }
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch file content: ${response.statusText}`)
  }
  return response.text()
}

export function useFileContent(owner: string, repo: string, filePath?: string) {
  return useQuery({
    queryKey: ["content", owner, repo, filePath],
    queryFn: () => fetchFileContentByPath(owner, repo, filePath!),
    enabled: !!owner && !!repo && !!filePath,
    staleTime: 5 * 60 * 1000, // 5 minutes TTL
  })
}
