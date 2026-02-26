"use client"

import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export default function GlobalSearch() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsExpanded(false)
      setQuery("")
    }
  }

  return (
    <div className="relative flex items-center">
      <form onSubmit={handleSearch} className={cn("relative flex items-center transition-all duration-300 ease-in-out", isExpanded ? "w-64" : "w-40")}>
        <Search className={cn("absolute left-3 w-4 h-4 transition-colors z-10", isExpanded ? "text-primary" : "text-muted-foreground")} />
        <Input
          ref={inputRef}
          type="text"
          placeholder="搜索影片..."
          className={cn(
            "pl-9 pr-12 h-9 rounded-full bg-muted/50 border-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-background",
            !isExpanded && "cursor-pointer hover:bg-muted",
          )}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onBlur={() => {
            if (!query.trim()) {
              setIsExpanded(false)
            }
          }}
        />
        {!isExpanded && (
          <div className="absolute right-3 flex items-center pointer-events-none">
            <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        )}
      </form>
    </div>
  )
}
