"use client"

import { NestedTreeItem } from "@/lib/tree-utils"
import { cn } from "@/lib/utils"
import { ChevronRight, FileText, Folder } from "lucide-react"
import { useState } from "react"

interface TreeItemProps {
  item: NestedTreeItem;
  selectedSha?: string;
  onFileClick: (path: string) => void;
  level?: number;
}

function hasSelectedChildRecursive(item: NestedTreeItem, selectedSha?: string): boolean {
  if (!selectedSha) return false
  return item.children.some(child => 
    child.sha === selectedSha || (child.type === 'tree' && hasSelectedChildRecursive(child, selectedSha))
  )
}

export function TreeItem({ item, selectedSha, onFileClick, level = 0 }: TreeItemProps) {
  const isSelected = selectedSha === item.sha
  const paddingLeft = level * 12 + 24 // Base 24px + 12px per level
  
  const hasSelectedChild = hasSelectedChildRecursive(item, selectedSha)
  const [isOpen, setIsOpen] = useState(hasSelectedChild)

  if (item.type === "tree") {
    const fileName = item.path.split("/").pop() || item.path
    
    return (
      <details 
        className="group" 
        open={isOpen}
        onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className="flex cursor-pointer items-center gap-2 py-2 px-4 hover:bg-zinc-100 transition-colors list-none [&::-webkit-details-marker]:hidden" style={{ paddingLeft: `${paddingLeft}px` }}>
          <ChevronRight size={14} className="text-zinc-400 transition-transform group-open:rotate-90" />
          <Folder size={16} className="text-zinc-500 fill-zinc-500/10" />
          <span className="text-sm font-medium text-zinc-700 truncate">{fileName}</span>
        </summary>
        <div className="flex flex-col">
          {item.children.map((child) => (
            <TreeItem 
              key={child.sha} 
              item={child} 
              selectedSha={selectedSha} 
              onFileClick={onFileClick} 
              level={level + 1} 
            />
          ))}
        </div>
      </details>
    )
  }

  const fileName = item.path.split("/").pop() || item.path
  const isMarkdown = item.path.endsWith(".md")

  return (
    <button
      onClick={() => isMarkdown && onFileClick(item.path)}
      disabled={!isMarkdown}
      className={cn(
        "flex w-full items-center gap-2 py-2 px-4 text-sm transition-all text-left group",
        isSelected 
          ? "bg-zinc-100 text-accent font-semibold border-r-2 border-accent" 
          : isMarkdown
            ? "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            : "text-zinc-400 cursor-not-allowed opacity-60"
      )}
      style={{ paddingLeft: `${paddingLeft + 22}px` }} // Align with summary text (chevron + folder icons)
    >
      <FileText size={16} className={cn(isSelected ? "text-accent" : isMarkdown ? "text-zinc-400" : "text-zinc-300")} />
      <span className="truncate">{fileName}</span>
    </button>
  )
}
