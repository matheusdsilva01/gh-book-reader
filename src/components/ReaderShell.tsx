"use client"

import { useState, useCallback } from "react"
import { Sidebar } from "./Sidebar"
import { MobileHeader } from "./MobileHeader"
import { GitHubTreeItem } from "@/types/github"

interface ReaderShellProps {
  children: React.ReactNode;
  tree: GitHubTreeItem[];
  selectedSha?: string;
  repoName: string;
  isLoading?: boolean;
}

export function ReaderShell({ children, tree, selectedSha, repoName, isLoading }: ReaderShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleOpenSidebar = useCallback(() => {
    setIsSidebarOpen(true)
  }, [])

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false)
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        tree={tree} 
        selectedSha={selectedSha} 
        isOpen={isSidebarOpen} 
        onClose={handleCloseSidebar} 
        isLoading={isLoading}
      />
      
      <div className="flex flex-1 flex-col min-w-0 relative">
        <MobileHeader 
          repoName={repoName} 
          onMenuClick={handleOpenSidebar} 
        />

        {children}
      </div>
    </div>
  )
}
