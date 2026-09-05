export interface RecentRepository {
  owner: string
  repo: string
  lastFile?: string
  openedAt: number
}

export interface SaveRecentRepositoryInput {
  owner: string
  repo: string
  lastFile?: string
}

const MAX_RECENT_REPOSITORIES = 5

function isRecentRepository(value: unknown): value is RecentRepository {
  if (!value || typeof value !== "object") return false

  const repository = value as Record<string, unknown>

  return typeof repository.owner === "string"
    && repository.owner.length > 0
    && typeof repository.repo === "string"
    && repository.repo.length > 0
    && (repository.lastFile === undefined || typeof repository.lastFile === "string")
    && typeof repository.openedAt === "number"
    && Number.isFinite(repository.openedAt)
    && !Number.isNaN(new Date(repository.openedAt).getTime())
}

function getRecentRepositoryKey(repository: Pick<RecentRepository, "owner" | "repo">) {
  return `${repository.owner.toLowerCase()}/${repository.repo.toLowerCase()}`
}

export function normalizeRecentRepositories(value: unknown): RecentRepository[] {
  if (!Array.isArray(value)) return []

  const seenRepositories = new Set<string>()

  return value
    .filter(isRecentRepository)
    .sort((a, b) => b.openedAt - a.openedAt)
    .filter((repository) => {
      const key = getRecentRepositoryKey(repository)
      if (seenRepositories.has(key)) return false

      seenRepositories.add(key)
      return true
    })
    .slice(0, MAX_RECENT_REPOSITORIES)
}

export function upsertRecentRepository(
  repositories: RecentRepository[],
  input: SaveRecentRepositoryInput,
  openedAt: number,
): RecentRepository[] {
  const inputKey = getRecentRepositoryKey(input)
  const previous = repositories.find((repository) => getRecentRepositoryKey(repository) === inputKey)
  const nextRepository: RecentRepository = {
    owner: input.owner,
    repo: input.repo,
    lastFile: input.lastFile ?? previous?.lastFile,
    openedAt,
  }

  return [
    nextRepository,
    ...repositories.filter((repository) => getRecentRepositoryKey(repository) !== inputKey),
  ].slice(0, MAX_RECENT_REPOSITORIES)
}

export function withoutRecentRepository(
  repositories: RecentRepository[],
  owner: string,
  repo: string,
): RecentRepository[] {
  const removedRepositoryKey = getRecentRepositoryKey({ owner, repo })
  return repositories.filter((repository) => getRecentRepositoryKey(repository) !== removedRepositoryKey)
}

export function getRecentRepositoryHref(repository: RecentRepository) {
  const href = `/reader/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.repo)}`
  if (!repository.lastFile) return href

  const params = new URLSearchParams({ file: repository.lastFile })
  return `${href}?${params.toString()}`
}
