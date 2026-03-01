"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/formatDate"

interface HistoryItem {
  id: number
  dramaId: number
  sourceName: string
  title: string
  cover: string | null
  total: number | null
  year: string | null
  time: string | null
  lastEpisodeIndex: number
  lastEpisodeName: string | null
  lastPositionSec: number
  durationSec: number | null
  updatedAt: string
}

function formatDuration(seconds: number) {
  const safe = Math.max(Math.floor(seconds), 0)
  const mm = Math.floor(safe / 60)
  const ss = safe % 60
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`
}

export default function HistoryList() {
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [rows, setRows] = useState<HistoryItem[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const loadPage = useCallback(async (nextPage: number, append: boolean) => {
    if (append) setLoadingMore(true)
    else setLoading(true)

    try {
      const res = await fetch(`/api/history?page=${nextPage}&limit=20`)
      if (!res.ok) throw new Error("fetch failed")
      const payload = await res.json()
      const dataRows: HistoryItem[] = payload?.data?.rows ?? []

      setRows((prev) => (append ? [...prev, ...dataRows] : dataRows))
      setPage(payload?.data?.page ?? nextPage)
      setHasMore(Boolean(payload?.data?.hasMore))
    } catch {
      toast.error("加载历史记录失败")
      if (!append) setRows([])
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    loadPage(1, false)
  }, [loadPage])

  const removeItem = useCallback(async (dramaId: number, sourceName: string) => {
    try {
      const res = await fetch("/api/history", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dramaId, sourceName }),
      })
      if (!res.ok) throw new Error("remove failed")
      setRows((prev) => prev.filter((item) => !(item.dramaId === dramaId && item.sourceName === sourceName)))
      toast.success("已删除历史记录")
    } catch {
      toast.error("删除失败")
    }
  }, [])

  const clearAll = useCallback(async () => {
    try {
      const res = await fetch("/api/history", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clearAll: true }),
      })
      if (!res.ok) throw new Error("clear failed")
      setRows([])
      setHasMore(false)
      toast.success("已清空历史记录")
    } catch {
      toast.error("清空失败")
    }
  }, [])

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="flex min-h-56 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )
    }

    if (rows.length === 0) {
      return <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">还没有观看历史</div>
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={clearAll}>
            清空记录
          </Button>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {rows.map((item) => (
            <Card key={item.id} className="mx-auto w-full max-w-72 overflow-hidden py-0">
              <CardContent className="p-0">
                <div className="relative aspect-[16/9] w-full">
                  <Image src={item.cover || "/logo.svg"} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>

                <div className="space-y-3 p-4">
                  <h3 className="line-clamp-2 text-base font-semibold">{item.title}</h3>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>看到: {item.lastEpisodeName || `第 ${item.lastEpisodeIndex + 1} 集`}</p>
                    <p>
                      进度: {formatDuration(item.lastPositionSec)} / {formatDuration(item.durationSec || 0)}
                    </p>
                    <p>更新时间: {formatDate(item.updatedAt) || "-"}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1" size="sm">
                      <Link href={`/detail/${item.dramaId}?source=${encodeURIComponent(item.sourceName || "")}&ep=${item.lastEpisodeIndex}`}>继续观看</Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => removeItem(item.dramaId, item.sourceName)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center pt-2">
            <Button variant="outline" onClick={() => loadPage(page + 1, true)} disabled={loadingMore}>
              {loadingMore ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              加载更多
            </Button>
          </div>
        )}
      </div>
    )
  }, [clearAll, hasMore, loadPage, loading, loadingMore, page, removeItem, rows])

  return content
}
