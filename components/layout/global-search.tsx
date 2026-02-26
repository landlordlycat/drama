"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
      {/* 移动端：图标按钮 + 展开后的搜索框 */}
      <div className="md:hidden">
        {isExpanded ? (
          <form onSubmit={handleSearch} className="fixed inset-x-0 top-16 z-50 bg-background/95 backdrop-blur-md px-4 py-3 border-b">
            <div className="relative flex items-center gap-2">
              <Search className="absolute left-3 w-4 h-4 text-muted-foreground z-10" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="搜索影片..."
                className="pl-9 h-10 rounded-full bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsExpanded(false)
                  setQuery("")
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </form>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* 桌面端：原有搜索框 */}
      <form onSubmit={handleSearch} className={cn("hidden md:flex relative items-center transition-all duration-300 ease-in-out", isExpanded ? "w-64" : "w-40")}>
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
