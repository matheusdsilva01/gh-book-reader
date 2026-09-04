"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { experimental_createQueryPersister } from "@tanstack/react-query-persist-client"
import { useState } from "react"

const CACHE_TIME = 24 * 60 * 60 * 1000

const persister = typeof window !== "undefined"
  ? experimental_createQueryPersister({
      storage: window.localStorage,
      maxAge: CACHE_TIME,
    })
  : undefined

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        persister: persister?.persisterFn,
        staleTime: CACHE_TIME,
      }
    }
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
