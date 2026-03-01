"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { HeartOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/formatDate"

interface FavoriteItem {
  id: number
  dramaId: number
  sourceName: string
  title: string
  cover: string | null
  remarks: string | null
  total: number | null
  year: string | null
  time: string | null
}

export default function CollectList() {
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<FavoriteItem[]>([])

  const fetchFavorites = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/favorites")
      if (!res.ok) throw new Error("fetch failed")
      const payload = await res.json()
      setRows(Array.isArray(payload?.data) ? payload.data : [])
    } catch {
      toast.error("加载收藏夹失败")
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  const removeFavorite = useCallback(async (dramaId: number, sourceName: string) => {
    try {
      const res = await fetch("/api/favorites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dramaId,
          sourceName,
        }),
      })

      if (!res.ok) throw new Error("remove failed")
      setRows((prev) => prev.filter((item) => !(item.dramaId === dramaId && item.sourceName === sourceName)))
      toast.success("已取消收藏")
    } catch {
      toast.error("取消收藏失败")
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
      return <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">还没有收藏任何视频</div>
    }

    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {rows.map((item) => (
          <Card key={item.id} className="mx-auto w-full max-w-72 overflow-hidden py-0">
            <CardContent className="p-0">
              <div className="relative aspect-[16/9] w-full">
                <Image src={item.cover || "/logo.svg"} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>

              <div className="space-y-3 p-4">
                <h3 className="line-clamp-1  text-base font-semibold">{item.title}</h3>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>集数: {item.total || "-"}</p>
                  <p>年份: {item.year || "-"}</p>
                  <p>更新时间: {item.time ? formatDate(item.time) : "-"}</p>
                </div>

                <div className="flex gap-2">
                  <Button asChild className="flex-1" size="sm">
                    <Link href={`/detail/${item.dramaId}?source=${encodeURIComponent(item.sourceName || "")}`}>继续观看</Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => removeFavorite(item.dramaId, item.sourceName)}>
                    <HeartOff className="size-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }, [loading, removeFavorite, rows])

  return content
}
