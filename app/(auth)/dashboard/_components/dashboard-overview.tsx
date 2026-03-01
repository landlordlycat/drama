"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Clock3, Heart, History, Loader2, MonitorPlay, RefreshCw, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { formatDate } from "@/lib/formatDate"

interface SourceInfo {
  id?: number
  name: string
  url?: string
}

interface FavoriteItem {
  id: number
  title: string
}

interface HistoryItem {
  id: number
  title: string
  updatedAt: string
  lastEpisodeIndex: number
  lastEpisodeName: string | null
}

interface TrendPoint {
  date: string
  count: number
  day: string
}

function getGreeting(hour: number) {
  if (hour < 11) return "早上好"
  if (hour < 14) return "中午好"
  if (hour < 18) return "下午好"
  return "晚上好"
}

function buildEmptyTrend(days = 7): TrendPoint[] {
  const result: TrendPoint[] = []
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date()
    d.setUTCDate(d.getUTCDate() - i)
    const date = d.toISOString().slice(0, 10)
    result.push({ date, count: 0, day: date.slice(5) })
  }
  return result
}

function WeekTrendChart({ data }: { data: TrendPoint[] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0)
  const chartData = data.map((item) => ({ ...item, day: item.day || item.date.slice(5) }))
  const chartConfig = {
    count: {
      label: "观看次数",
      color: "var(--color-chart-1)",
    },
  } satisfies ChartConfig

  return (
    <div className="space-y-3">
      <ChartContainer config={chartConfig} className="h-40 w-full">
        <BarChart accessibilityLayer data={chartData} margin={{ left: -12, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
          <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${value} 次`} />} />
          <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
      <p className="text-xs text-muted-foreground">近 7 天累计观看更新 {total} 次</p>
    </div>
  )
}

export default function DashboardOverview() {
  const { data: session, isPending } = useSession()
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState<SourceInfo | null>(null)
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [trend, setTrend] = useState<TrendPoint[]>([])

  const loadOverview = useCallback(async () => {
    setLoading(true)
    try {
      const [sourceRes, favoritesRes, historyRes, trendRes] = await Promise.all([
        fetch("/api/admin/sources/default"),
        fetch("/api/favorites"),
        fetch("/api/history?page=1&limit=8"),
        fetch("/api/history/trend?days=7"),
      ])

      const sourcePayload = sourceRes.ok ? await sourceRes.json() : null
      const favoritesPayload = favoritesRes.ok ? await favoritesRes.json() : null
      const historyPayload = historyRes.ok ? await historyRes.json() : null
      const trendPayload = trendRes.ok ? await trendRes.json() : null

      const sourceData = sourcePayload?.data || sourcePayload
      setSource(sourceData?.name ? { name: sourceData.name, url: sourceData.url, id: sourceData.id } : null)
      setFavorites(Array.isArray(favoritesPayload?.data) ? favoritesPayload.data : [])
      setHistory(Array.isArray(historyPayload?.data?.rows) ? historyPayload.data.rows : [])
      setTrend(Array.isArray(trendPayload?.data) ? trendPayload.data.map((item: TrendPoint) => ({ ...item, day: item.date.slice(5) })) : [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadOverview()
  }, [loadOverview])

  const greetingText = useMemo(() => {
    const hour = new Date().getHours()
    const name = session?.user?.name?.trim() || session?.user?.email?.trim() || "用户"
    return `${getGreeting(hour)}，${name}`
  }, [session?.user?.email, session?.user?.name])

  if (isPending || loading) {
    return (
      <div className="flex min-h-[45vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const latestFavorite = favorites[0]
  const latestHistory = history[0]

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <Card className="py-4">
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xl font-semibold">{greetingText}</p>
            <p className="mt-1 text-sm text-muted-foreground">欢迎回来，继续管理你的内容。</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void loadOverview()}>
            <RefreshCw className="mr-2 size-4" />
            刷新数据
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="py-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <MonitorPlay className="size-4 text-primary" />
              当前播放源
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{source?.name || "未获取到默认源"}</p>
            <p className="line-clamp-2 text-muted-foreground">{source?.url || "-"}</p>
            <div className="pt-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/sources">管理播放源</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="size-4 text-red-500" />
              收藏夹状况
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">共 {favorites.length} 条收藏</p>
            <p className="line-clamp-1 text-muted-foreground">最近: {latestFavorite?.title || "暂无"}</p>
            <div className="pt-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/collect">查看收藏夹</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="size-4 text-primary" />
              历史记录
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">最近记录 {history.length} 条</p>
            <p className="line-clamp-1 text-muted-foreground">
              最近观看: {latestHistory ? `${latestHistory.title} · ${latestHistory.lastEpisodeName || `第 ${latestHistory.lastEpisodeIndex + 1} 集`}` : "暂无"}
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock3 className="size-3" />
              {latestHistory ? formatDate(latestHistory.updatedAt) : "-"}
            </p>
            <div className="pt-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/history">查看历史记录</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="py-4">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="size-4 text-primary" />
            近 7 天观看次数趋势
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WeekTrendChart data={trend.length > 0 ? trend : buildEmptyTrend(7)} />
        </CardContent>
      </Card>
    </div>
  )
}
