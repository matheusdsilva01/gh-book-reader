"use client"

import Link from "next/link"
import { BookOpen, Trash2 } from "lucide-react"
import { useSyncExternalStore } from "react"
import {
  clearRecentBooks,
  getRecentBookHref,
  getRecentBooks,
  getRecentBooksServerSnapshot,
  removeRecentBook,
  subscribeToRecentBooks,
} from "@/lib/recent-books"

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
})

export function RecentBooks() {
  const books = useSyncExternalStore(
    subscribeToRecentBooks,
    getRecentBooks,
    getRecentBooksServerSnapshot,
  )

  if (books.length === 0) return null

  return (
    <section className="mx-auto mt-16 w-full max-w-3xl text-left" aria-labelledby="recent-books-title">
      <div className="mb-4 flex items-end justify-between gap-4 px-1">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            Sua estante
          </p>
          <h2 id="recent-books-title" className="font-serif text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Continuar lendo
          </h2>
        </div>
        <button
          type="button"
          onClick={clearRecentBooks}
          className="pb-1 text-xs font-medium text-zinc-400 transition-colors hover:text-accent"
        >
          Limpar histórico
        </button>
      </div>

      <ol className="divide-y divide-sidebar-border border-y border-sidebar-border">
        {books.map((book, index) => (
          <li key={`${book.owner}/${book.repo}`} className="group flex items-center gap-3 py-4 sm:gap-5">
            <span className="w-6 shrink-0 font-mono text-[10px] text-zinc-300" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <BookOpen size={20} className="hidden shrink-0 text-accent sm:block" aria-hidden="true" />
            <Link
              href={getRecentBookHref(book)}
              className="min-w-0 flex-1 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            >
              <span className="block truncate font-sans text-sm font-semibold text-foreground transition-colors group-hover:text-accent sm:text-base">
                {book.repo}
              </span>
              <span className="mt-0.5 block truncate text-xs text-zinc-400">
                {book.owner}{book.lastFile ? ` · ${book.lastFile}` : " · Selecione um capítulo"}
              </span>
            </Link>
            <time dateTime={new Date(book.openedAt).toISOString()} className="hidden shrink-0 text-xs text-zinc-400 sm:block">
              {dateFormatter.format(book.openedAt)}
            </time>
            <button
              type="button"
              onClick={() => removeRecentBook(book.owner, book.repo)}
              className="shrink-0 rounded-full p-2 text-zinc-300 transition-colors hover:bg-sidebar-bg hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
              aria-label={`Remover ${book.owner}/${book.repo} do histórico`}
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
    </section>
  )
}
