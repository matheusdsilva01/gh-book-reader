"use client"

import { useSyncExternalStore } from "react"
import {
  getRecentRepositories,
  getRecentRepositoriesServerSnapshot,
  subscribeToRecentRepositories,
} from "@/lib/recent-repositories-store"

export function useRecentRepositories() {
  return useSyncExternalStore(
    subscribeToRecentRepositories,
    getRecentRepositories,
    getRecentRepositoriesServerSnapshot,
  )
}
