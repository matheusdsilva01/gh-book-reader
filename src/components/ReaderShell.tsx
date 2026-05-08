"use client"

import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { Menu } from "lucide-react"
import { GitHubTreeItem } from "@/types/github"

interface ReaderShellProps {
  children: React.ReactNode;
  tree: GitHubTreeItem[];
  selectedSha?: string;
}

export function ReaderShell({ children, tree, selectedSha }: ReaderShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar 
        tree={tree} 
        selectedSha={selectedSha} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Mobile Header */}
        <header className="flex h-14 items-center border-b border-sidebar-border/60 bg-sidebar-bg px-4 md:hidden">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-zinc-600 hover:text-zinc-900"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span className="ml-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            Arquivos
          </span>
        </header>

        {children}
      </div>
    </div>
  )
}
