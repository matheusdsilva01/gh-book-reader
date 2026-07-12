import { GitHubRepo, GitHubTree } from "../types/github"

const GITHUB_API_BASE = "https://api.github.com"

export async function fetchRepoInfo(
  owner: string,
  repo: string,
): Promise<GitHubRepo> {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`)
  if (!response.ok) throw new Error("Failed to fetch repo info", {
    cause: await response.text(),
  })
  return await response.json()
}

export async function fetchTree(
  owner: string,
  repo: string,
  sha: string,
): Promise<GitHubTree> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${sha}?recursive=1`
  )
  if (!response.ok) throw new Error("Failed to fetch tree", {
    cause: await response.text(),
  })
  return await response.json()
}


export async function fetchFileContentByPath(
  owner: string,
  repo: string,
  path: string,
): Promise<string> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        "Accept": "application/vnd.github.json",
      }
    },
  )
  const data = await response.json()
  if (!response.ok) throw new Error("Failed to fetch file content by path", {
    cause: await response.text(),
  })
  return Buffer.from(data.content, 'base64').toString() // Decode base64 content
}

export function parseGitHubUrl(
  url: string,
): { owner: string; repo: string } | null {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean)
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] }
    }
  } catch {
    return null
  }
  return null
}
