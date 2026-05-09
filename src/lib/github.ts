import { GitHubRepo, GitHubTree } from "../types/github"

const GITHUB_API_BASE = "https://api.github.com"

export async function fetchRepoInfo(
  owner: string,
  repo: string,
): Promise<GitHubRepo> {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
    next: {
      revalidate: 900, // Revalidate every 15 minutes
    }
  })
  if (!response.ok) throw new Error("Failed to fetch repo info", {
    cause: await response.text(),
  })
  return response.json()
}

export async function fetchTree(
  owner: string,
  repo: string,
  sha: string,
): Promise<GitHubTree> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${sha}?recursive=1`,
    {
      next: {
        revalidate: 900, // Revalidate every 15 minutes
      }
    }
  )
  if (!response.ok) throw new Error("Failed to fetch tree", {
    cause: response,
  })
  return response.json()
}

export async function fetchBlobContent(
  owner: string,
  repo: string,
  sha: string,
): Promise<string> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/blobs/${sha}`,
    {
      next: {
        revalidate: 900, // Revalidate every 15 minutes
      },
      headers: {
        "Accept": "application/vnd.github.v3.raw",
      }
    },
  )
  if (!response.ok) throw new Error("Failed to fetch blob content", {
    cause: await response.text(),
  })
  return response.text()
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
