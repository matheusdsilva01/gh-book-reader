"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { experimental_createQueryPersister } from "@tanstack/react-query-persist-client"
import { useState } from "react"

const persister = typeof window !== "undefined"
  ? experimental_createQueryPersister({
      storage: window.localStorage,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours persistent cache TTL
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    })
  : undefined

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        persister: persister?.persisterFn,
        gcTime: 24 * 60 * 60 * 1000, // Keep in memory cache up to 24 hours
      }
    }
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
