"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Heart, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

interface FavoriteToggleProps {
  drama: {
    id: number
    title: string
    cover?: string
    remarks?: string
    total?: number
    year?: string
    time?: string
  }
  sourceName: string
  className?: string
}

export default function FavoriteToggle({ drama, sourceName, className }: FavoriteToggleProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [favorited, setFavorited] = useState(false)
  const [checking, setChecking] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const source = useMemo(() => sourceName?.trim() || "", [sourceName])

  useEffect(() => {
    if (!session?.user?.id) {
      setFavorited(false)
      setChecking(false)
      return
    }

    let active = true
    setChecking(true)

    fetch(`/api/favorites?dramaId=${drama.id}&sourceName=${encodeURIComponent(source)}`)
      .then(async (res) => {
        if (!res.ok) return null
        return res.json()
      })
      .then((payload) => {
        if (!active) return
        setFavorited(Boolean(payload?.data?.favorited))
      })
      .catch(() => {
        if (active) setFavorited(false)
      })
      .finally(() => {
        if (active) setChecking(false)
      })

    return () => {
      active = false
    }
  }, [drama.id, session?.user?.id, source])

  const handleToggle = useCallback(async () => {
    if (!session?.user?.id) {
      toast.error("请先登录后再收藏")
      router.push("/sign-in")
      return
    }

    setSubmitting(true)
    try {
      if (favorited) {
        const res = await fetch("/api/favorites", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dramaId: drama.id,
            sourceName: source,
          }),
        })
        if (!res.ok) throw new Error("remove failed")
        setFavorited(false)
        toast.success("已取消收藏")
        return
      }

      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dramaId: drama.id,
          sourceName: source,
          title: drama.title,
          cover: drama.cover,
          remarks: drama.remarks,
          total: drama.total,
          year: drama.year,
          time: drama.time,
        }),
      })

      if (!res.ok) throw new Error("add failed")
      setFavorited(true)
      toast.success("收藏成功")
    } catch {
      toast.error("操作失败，请稍后重试")
    } finally {
      setSubmitting(false)
    }
  }, [drama, favorited, router, session?.user?.id, source])

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "gap-2",
        favorited && "border-red-500 text-red-500 hover:border-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20",
        className,
      )}
      onClick={handleToggle}
      disabled={checking || submitting}
    >
      {checking || submitting ? <Loader2 className="size-4 animate-spin" /> : <Heart className={cn("size-4", favorited ? "fill-current text-red-500" : "")} />}
      {favorited ? "已收藏" : "收藏"}
    </Button>
  )
}
