export interface RecentBook {
  owner: string
  repo: string
  lastFile?: string
  openedAt: number
}

export interface SaveRecentBookInput {
  owner: string
  repo: string
  lastFile?: string
}

const MAX_RECENT_BOOKS = 5

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

function getRecentBookKey(book: Pick<RecentBook, "owner" | "repo">) {
  return `${book.owner.toLowerCase()}/${book.repo.toLowerCase()}`
}

export function normalizeRecentBooks(value: unknown): RecentBook[] {
  if (!Array.isArray(value)) return []

  const seenBooks = new Set<string>()

  return value
    .filter(isRecentBook)
    .sort((a, b) => b.openedAt - a.openedAt)
    .filter((book) => {
      const key = getRecentBookKey(book)
      if (seenBooks.has(key)) return false

      seenBooks.add(key)
      return true
    })
    .slice(0, MAX_RECENT_BOOKS)
}

export function upsertRecentBook(
  books: RecentBook[],
  input: SaveRecentBookInput,
  openedAt: number,
): RecentBook[] {
  const inputKey = getRecentBookKey(input)
  const previous = books.find((book) => getRecentBookKey(book) === inputKey)
  const nextBook: RecentBook = {
    owner: input.owner,
    repo: input.repo,
    lastFile: input.lastFile ?? previous?.lastFile,
    openedAt,
  }

  return [
    nextBook,
    ...books.filter((book) => getRecentBookKey(book) !== inputKey),
  ].slice(0, MAX_RECENT_BOOKS)
}

export function withoutRecentBook(books: RecentBook[], owner: string, repo: string): RecentBook[] {
  const removedBookKey = getRecentBookKey({ owner, repo })
  return books.filter((book) => getRecentBookKey(book) !== removedBookKey)
}

export function getRecentBookHref(book: RecentBook) {
  const href = `/reader/${encodeURIComponent(book.owner)}/${encodeURIComponent(book.repo)}`
  if (!book.lastFile) return href

  const params = new URLSearchParams({ file: book.lastFile })
  return `${href}?${params.toString()}`
}
