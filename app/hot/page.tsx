import DramaHeader from "@/components/layout/drama-header"
import { Suspense } from "react"
import HotList from "./_components/hot-list"
import { Skeleton } from "@/components/ui/skeleton"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "热门推荐",
  description: "最受欢迎的热门短剧推荐，精选优质内容，发现精彩剧集。",
}

export default function HotPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  return (
    <div className="min-h-screen bg-background">
      <DramaHeader />

      <main className="max-w-300 mx-auto px-4 md:px-10 py-8">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">热门推荐</h1>
          <p className="text-muted-foreground">最受欢迎的剧集推荐</p>
        </div>

        <Suspense fallback={<HotSkeleton />}>
          <HotContent searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  )
}

async function HotContent({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams
  const currentPage = page ? Number(page) : 1

  return <HotList page={currentPage} />
}

function HotSkeleton() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}
