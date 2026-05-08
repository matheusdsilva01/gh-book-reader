"use client"

import { useState } from "react"
import { Search } from "lucide-react"

interface RepoInputProps {
  onSearch: (url: string) => void;
}

export function RepoInput({ onSearch }: RepoInputProps) {
  const [url, setUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onSearch(url.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        <label htmlFor="repo-url" className="sr-only">
          URL do repositório GitHub
        </label>
        <input
          id="repo-url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Cole a URL do repositório GitHub..."
          autoComplete="url"
          className="w-full rounded-full border-none bg-transparent py-3 pr-14 pl-6 text-base text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
        <button
          type="submit"
          aria-label="Pesquisar repositório"
          className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition-all hover:bg-accent active:scale-95 shadow-sm"
        >
          <Search size={18} />
        </button>
      </div>
    </form>
  )
}
