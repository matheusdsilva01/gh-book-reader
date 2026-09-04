export interface RecentBook {
  owner: string
  repo: string
  lastFile?: string
  openedAt: number
}

interface SaveRecentBookInput {
  owner: string
  repo: string
  lastFile?: string
}

const STORAGE_KEY = "gh-book-reader:recent-books:v1"
const MAX_RECENT_BOOKS = 5
const RECENT_BOOKS_EVENT = "gh-book-reader:recent-books-changed"
const EMPTY_RECENT_BOOKS: RecentBook[] = []

let cachedStorageValue: string | null | undefined
let cachedRecentBooks = EMPTY_RECENT_BOOKS

function isRecentBook(value: unknown): value is RecentBook {
  if (!value || typeof value !== "object") return false

  const book = value as Record<string, unknown>

  return typeof book.owner === "string"
    && book.owner.length > 0
    && typeof book.repo === "string"
    && book.repo.length > 0
    && (book.lastFile === undefined || typeof book.lastFile === "string")
    && typeof book.openedAt === "number"
    && Number.isFinite(book.openedAt)
    && !Number.isNaN(new Date(book.openedAt).getTime())
}

function persistRecentBooks(books: RecentBook[], fallback: RecentBook[]) {
  try {
    const storageValue = JSON.stringify(books)
    window.localStorage.setItem(STORAGE_KEY, storageValue)
    cachedStorageValue = storageValue
    cachedRecentBooks = books
    window.dispatchEvent(new Event(RECENT_BOOKS_EVENT))
    return books
  } catch {
    return fallback
  }
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
    if (!Array.isArray(storedBooks)) {
      cachedRecentBooks = EMPTY_RECENT_BOOKS
      return cachedRecentBooks
    }

    const seenBooks = new Set<string>()

    cachedRecentBooks = storedBooks
      .filter(isRecentBook)
      .sort((a, b) => b.openedAt - a.openedAt)
      .filter((book) => {
        const key = `${book.owner.toLowerCase()}/${book.repo.toLowerCase()}`
        if (seenBooks.has(key)) return false

        seenBooks.add(key)
        return true
      })
      .slice(0, MAX_RECENT_BOOKS)
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

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return

    cachedStorageValue = undefined
    onStoreChange()
  }

  window.addEventListener("storage", handleStorage)
  window.addEventListener(RECENT_BOOKS_EVENT, onStoreChange)

  return () => {
    window.removeEventListener("storage", handleStorage)
    window.removeEventListener(RECENT_BOOKS_EVENT, onStoreChange)
  }
}

export function saveRecentBook(input: SaveRecentBookInput): RecentBook[] {
  if (typeof window === "undefined") return EMPTY_RECENT_BOOKS

  const books = getRecentBooks()
  const normalizedOwner = input.owner.toLowerCase()
  const normalizedRepo = input.repo.toLowerCase()
  const previous = books.find(
    (book) => book.owner.toLowerCase() === normalizedOwner && book.repo.toLowerCase() === normalizedRepo,
  )
  const nextBook: RecentBook = {
    owner: input.owner,
    repo: input.repo,
    lastFile: input.lastFile ?? previous?.lastFile,
    openedAt: Date.now(),
  }
  const nextBooks = [
    nextBook,
    ...books.filter(
      (book) => book.owner.toLowerCase() !== normalizedOwner || book.repo.toLowerCase() !== normalizedRepo,
    ),
  ].slice(0, MAX_RECENT_BOOKS)

  return persistRecentBooks(nextBooks, books)
}

export function removeRecentBook(owner: string, repo: string): RecentBook[] {
  if (typeof window === "undefined") return EMPTY_RECENT_BOOKS

  const books = getRecentBooks()
  const normalizedOwner = owner.toLowerCase()
  const normalizedRepo = repo.toLowerCase()
  const nextBooks = books.filter(
    (book) => book.owner.toLowerCase() !== normalizedOwner || book.repo.toLowerCase() !== normalizedRepo,
  )

  return persistRecentBooks(nextBooks, books)
}

export function clearRecentBooks(): RecentBook[] {
  if (typeof window === "undefined") return EMPTY_RECENT_BOOKS

  const books = getRecentBooks()

  try {
    window.localStorage.removeItem(STORAGE_KEY)
    cachedStorageValue = null
    cachedRecentBooks = EMPTY_RECENT_BOOKS
    window.dispatchEvent(new Event(RECENT_BOOKS_EVENT))
    return EMPTY_RECENT_BOOKS
  } catch {
    return books
  }
}

export function getRecentBookHref(book: RecentBook) {
  const href = `/reader/${encodeURIComponent(book.owner)}/${encodeURIComponent(book.repo)}`
  if (!book.lastFile) return href

  const params = new URLSearchParams({ file: book.lastFile })
  return `${href}?${params.toString()}`
}
