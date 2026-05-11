"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "./Sidebar"
import { Menu } from "lucide-react"
import { GitHubTreeItem } from "@/types/github"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ReaderShellProps {
  children: React.ReactNode;
  tree: GitHubTreeItem[];
  selectedSha?: string;
  repoName: string;
}

export function ReaderShell({ children, tree, selectedSha, repoName }: ReaderShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < 10) {
        setShowHeader(true)
      } else if (currentScrollY > lastScrollY) {
        setShowHeader(false)
      } else {
        setShowHeader(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        tree={tree} 
        selectedSha={selectedSha} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex flex-1 flex-col min-w-0 relative">
        {/* Mobile Header */}
        <header className={cn(
          "sticky top-0 z-10 flex h-14 w-full items-center border-b border-sidebar-border/60 bg-sidebar-bg px-4 transition-transform duration-300 ease-in-out md:hidden",
          !showHeader && "-translate-y-full"
        )}>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-zinc-600 hover:text-zinc-900"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span className="ml-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            {repoName}
          </span>
        </header>

        {children}
      </div>
    </div>
  )
}
