import DramaHeader from "@/components/layout/drama-header"
import { Suspense } from "react"
import SearchResultsList from "./_components/search-results-list"
import { Skeleton } from "@/components/ui/skeleton"

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams

  return (
    <div className="min-h-screen bg-background">
      <DramaHeader />

      <main className="max-w-300 mx-auto px-4 md:px-10 py-8">
        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">搜索结果</h1>
            <p className="text-muted-foreground">
              关键词: <span className="text-foreground font-medium">{q}</span>
            </p>
          </div>

          <Suspense fallback={<SearchSkeleton />}>
            <SearchResultsList query={q} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

function SearchSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-6 w-48 bg-muted animate-pulse rounded" />
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
