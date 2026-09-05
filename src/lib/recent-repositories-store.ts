import {
  normalizeRecentRepositories,
  upsertRecentRepository,
  withoutRecentRepository,
} from "./recent-repositories"
import type { RecentRepository, SaveRecentRepositoryInput } from "./recent-repositories"

const STORAGE_KEY = "reader.md:recent-repositories:v1"
const EMPTY_RECENT_REPOSITORIES: RecentRepository[] = []
const listeners = new Set<() => void>()

let cachedStorageValue: string | null | undefined
let cachedRecentRepositories = EMPTY_RECENT_REPOSITORIES

function notifySubscribers() {
  listeners.forEach((listener) => {
    try {
      listener()
    } catch (error) {
      console.error("Failed to notify a recent repositories subscriber.", error)
    }
  })
}

function persistRecentRepositories(
  repositories: RecentRepository[],
  fallback: RecentRepository[],
) {
  let storageValue: string

  try {
    storageValue = JSON.stringify(repositories)
    window.localStorage.setItem(STORAGE_KEY, storageValue)
  } catch {
    return fallback
  }

  cachedStorageValue = storageValue
  cachedRecentRepositories = repositories
  notifySubscribers()
  return repositories
}

export function getRecentRepositories(): RecentRepository[] {
  if (typeof window === "undefined") return EMPTY_RECENT_REPOSITORIES

  try {
    const storageValue = window.localStorage.getItem(STORAGE_KEY)
    if (storageValue === cachedStorageValue) return cachedRecentRepositories

    cachedStorageValue = storageValue
    if (storageValue === null) {
      cachedRecentRepositories = EMPTY_RECENT_REPOSITORIES
      return cachedRecentRepositories
    }

    const storedRepositories: unknown = JSON.parse(storageValue)
    cachedRecentRepositories = normalizeRecentRepositories(storedRepositories)
    return cachedRecentRepositories
  } catch {
    cachedStorageValue = undefined
    cachedRecentRepositories = EMPTY_RECENT_REPOSITORIES
    return cachedRecentRepositories
  }
}

export function getRecentRepositoriesServerSnapshot() {
  return EMPTY_RECENT_REPOSITORIES
}

export function subscribeToRecentRepositories(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => undefined

  const listener = () => onStoreChange()
  listeners.add(listener)

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return

    cachedStorageValue = undefined
    onStoreChange()
  }

  window.addEventListener("storage", handleStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", handleStorage)
  }
}

export function saveRecentRepository(input: SaveRecentRepositoryInput): RecentRepository[] {
  if (typeof window === "undefined") return EMPTY_RECENT_REPOSITORIES

  const repositories = getRecentRepositories()
  const nextRepositories = upsertRecentRepository(repositories, input, Date.now())
  return persistRecentRepositories(nextRepositories, repositories)
}

export function removeRecentRepository(owner: string, repo: string): RecentRepository[] {
  if (typeof window === "undefined") return EMPTY_RECENT_REPOSITORIES

  const repositories = getRecentRepositories()
  const nextRepositories = withoutRecentRepository(repositories, owner, repo)
  return persistRecentRepositories(nextRepositories, repositories)
}

export function clearRecentRepositories(): RecentRepository[] {
  if (typeof window === "undefined") return EMPTY_RECENT_REPOSITORIES

  const repositories = getRecentRepositories()

  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    return repositories
  }

  cachedStorageValue = null
  cachedRecentRepositories = EMPTY_RECENT_REPOSITORIES
  notifySubscribers()
  return EMPTY_RECENT_REPOSITORIES
}
