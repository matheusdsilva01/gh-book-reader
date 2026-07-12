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
