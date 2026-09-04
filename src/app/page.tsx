"use client"

import { useRouter } from "next/navigation"
import { RepoInput } from "@/components/RepoInput"
import { parseGitHubUrl } from "@/lib/github"
import { useState } from "react"
import { RecentBooks } from "@/components/RecentBooks"

export default function Home() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSearch = (url: string) => {
    const parsed = parseGitHubUrl(url)
    if (!parsed) {
      setError("Invalid GitHub URL.")
      return
    }
    router.push(`/reader/${parsed.owner}/${parsed.repo}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 md:px-12">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center py-16 md:py-24">
        <div className="mx-auto w-full max-w-xl text-center">
          <div className="mb-10 md:mb-16">
            <h1 className="mb-6 font-serif text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
              GitHub Book Reader
            </h1>
            <p className="font-sans text-base md:text-lg text-zinc-500 leading-relaxed max-w-md mx-auto px-4 md:px-0">
              Transforme os livros do Github em uma experiência de leitura bonita.
            </p>
          </div>
          <div className="bg-sidebar-bg p-1.5 md:p-2 rounded-full border border-sidebar-border shadow-sm mb-8 transition-all focus-within:ring-4 focus-within:ring-accent/5">
            <RepoInput onSearch={handleSearch} />
          </div>
          {error && (
            <p className="text-sm font-medium text-accent animate-in fade-in slide-in-from-top-1">
              {error}
            </p>
          )}
        </div>

        <RecentBooks />
      </main>
      <footer className="pb-8 text-center text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-zinc-300">
        Feito por <a href="https://github.com/matheusdsilva01" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">github.com/matheusdsilva01</a>
      </footer>
    </div>
  )
}
