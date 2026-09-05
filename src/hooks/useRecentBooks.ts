"use client"

import { useSyncExternalStore } from "react"
import {
  getRecentBooks,
  getRecentBooksServerSnapshot,
  subscribeToRecentBooks,
} from "@/lib/recent-books-store"

export function useRecentBooks() {
  return useSyncExternalStore(
    subscribeToRecentBooks,
    getRecentBooks,
    getRecentBooksServerSnapshot,
  )
}
