"use client"

import { useState, useEffect, useRef, memo } from "react"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileHeaderProps {
  repoName: string;
  onMenuClick: () => void;
}

const SCROLL_THRESHOLD = 80
const TOP_OFFSET = 10

export const MobileHeader = memo(function MobileHeader({ repoName, onMenuClick }: MobileHeaderProps) {
  const [showHeader, setShowHeader] = useState(true)
  const lastScrollY = useRef(0)
  const scrollUpAmount = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const diff = currentScrollY - lastScrollY.current
      lastScrollY.current = currentScrollY

      if (currentScrollY < TOP_OFFSET) {
        setShowHeader(true)
        scrollUpAmount.current = 0
        return
      }

      if (diff > 0) {
        setShowHeader(false)
        scrollUpAmount.current = 0
        return
      }

      // Scrolling up
      scrollUpAmount.current += Math.abs(diff)
      if (scrollUpAmount.current > SCROLL_THRESHOLD) {
        setShowHeader(true)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={cn(
      "sticky top-0 z-10 flex h-14 w-full items-center border-b border-sidebar-border/60 bg-sidebar-bg px-4 transition-transform duration-300 ease-in-out md:hidden",
      !showHeader && "-translate-y-full"
    )}>
      <button 
        onClick={onMenuClick}
        className="p-2 -ml-2 text-zinc-600 hover:text-zinc-900"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>
      <span className="ml-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
        {repoName}
      </span>
    </header>
  )
})
