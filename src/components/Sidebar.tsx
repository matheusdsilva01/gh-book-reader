"use client"

import { useRouter } from "next/navigation"
import { GitHubTreeItem } from "@/types/github"
import { ChevronRight } from "lucide-react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { buildNestedTree } from "@/lib/tree-utils"
import { TreeItem } from "./TreeItem"
import { useMemo } from "react"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface SidebarProps {
  tree: GitHubTreeItem[];
  selectedSha?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ tree, selectedSha, isOpen, onClose }: SidebarProps) {
  const router = useRouter()

  const nestedTree = useMemo(() => {
    return buildNestedTree(tree)
  }, [tree])

  const handleFileClick = (path: string) => {
    const params = new URLSearchParams()
    params.set("file", path)
    router.push(`?${params.toString()}`)
    if (onClose) onClose()
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-zinc-950/20 backdrop-blur-sm md:hidden" 
          onClick={onClose}
        />
      )}
      
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar-bg font-sans transition-transform duration-300 ease-in-out md:static md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-8 border-b border-sidebar-border/60">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Arquivos</h2>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 -mr-2 text-zinc-400 hover:text-zinc-900 md:hidden"
              aria-label="Close menu"
            >
              <ChevronRight size={18} className="rotate-180" />
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          {nestedTree.map((item) => (
            <TreeItem 
              key={item.sha} 
              item={item} 
              selectedSha={selectedSha} 
              onFileClick={handleFileClick} 
            />
          ))}
        </div>
      </div>
    </>
  )
}
