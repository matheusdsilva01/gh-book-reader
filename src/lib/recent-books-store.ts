import {
  normalizeRecentBooks,
  upsertRecentBook,
  withoutRecentBook,
} from "./recent-books"
import type { RecentBook, SaveRecentBookInput } from "./recent-books"

const STORAGE_KEY = "gh-book-reader:recent-books:v1"
const EMPTY_RECENT_BOOKS: RecentBook[] = []
const listeners = new Set<() => void>()

let cachedStorageValue: string | null | undefined
let cachedRecentBooks = EMPTY_RECENT_BOOKS

function notifySubscribers() {
  listeners.forEach((listener) => {
    try {
      listener()
    } catch (error) {
      console.error("Failed to notify a recent books subscriber.", error)
    }
  })
}

function persistRecentBooks(books: RecentBook[], fallback: RecentBook[]) {
  let storageValue: string

  try {
    storageValue = JSON.stringify(books)
    window.localStorage.setItem(STORAGE_KEY, storageValue)
  } catch {
    return fallback
  }

  cachedStorageValue = storageValue
  cachedRecentBooks = books
  notifySubscribers()
  return books
}

export function getRecentBooks(): RecentBook[] {
  if (typeof window === "undefined") return EMPTY_RECENT_BOOKS

  try {
    const storageValue = window.localStorage.getItem(STORAGE_KEY)
    if (storageValue === cachedStorageValue) return cachedRecentBooks

    cachedStorageValue = storageValue
    if (storageValue === null) {
      cachedRecentBooks = EMPTY_RECENT_BOOKS
      return cachedRecentBooks
    }

    const storedBooks: unknown = JSON.parse(storageValue)
    cachedRecentBooks = normalizeRecentBooks(storedBooks)
    return cachedRecentBooks
  } catch {
    cachedStorageValue = undefined
    cachedRecentBooks = EMPTY_RECENT_BOOKS
    return cachedRecentBooks
  }
}

export function getRecentBooksServerSnapshot() {
  return EMPTY_RECENT_BOOKS
}

export function subscribeToRecentBooks(onStoreChange: () => void) {
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

export function saveRecentBook(input: SaveRecentBookInput): RecentBook[] {
  if (typeof window === "undefined") return EMPTY_RECENT_BOOKS

  const books = getRecentBooks()
  const nextBooks = upsertRecentBook(books, input, Date.now())
  return persistRecentBooks(nextBooks, books)
}

export function removeRecentBook(owner: string, repo: string): RecentBook[] {
  if (typeof window === "undefined") return EMPTY_RECENT_BOOKS

  const books = getRecentBooks()
  const nextBooks = withoutRecentBook(books, owner, repo)
  return persistRecentBooks(nextBooks, books)
}

export function clearRecentBooks(): RecentBook[] {
  if (typeof window === "undefined") return EMPTY_RECENT_BOOKS

  const books = getRecentBooks()

  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    return books
  }

  cachedStorageValue = null
  cachedRecentBooks = EMPTY_RECENT_BOOKS
  notifySubscribers()
  return EMPTY_RECENT_BOOKS
}
