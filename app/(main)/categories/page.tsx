import DramaHeader from "@/components/layout/drama-header"
import { dramaApiService } from "@/lib/services/drama-api"
import { Suspense } from "react"
import CategoryFilter from "./_components/category-filter"
import CategoryList from "./_components/category-list"
import { Skeleton } from "@/components/ui/skeleton"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "分类浏览",
  description: "按类型浏览短剧，发现您喜欢的内容。支持多种分类筛选，快速找到感兴趣的短剧。",
}

export default function Categories({ searchParams }: { searchParams: Promise<{ typeId?: string; page?: string }> }) {
  return (
    <div className="min-h-screen bg-background mb-10">
      <Suspense fallback={<div className="h-16" />}>
        <DramaHeader />
      </Suspense>
      <main className="max-w-300 mx-auto px-4 md:px-10">
        <Suspense fallback={<div className="h-14" />}>
          <CategoriesContent searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  )
}

async function CategoriesContent({ searchParams }: { searchParams: Promise<{ typeId?: string; page?: string }> }) {
  const { typeId, page } = await searchParams
  const defaultSource = await dramaApiService.getDefaultSource()
  const typesRes = await dramaApiService.getTypes({ source: defaultSource })

  return (
    <>
      <Suspense>
        <CategoryFilter types={typesRes.types} />
      </Suspense>

      <Suspense fallback={<CategorySkeleton />}>
        <CategoryList typeId={typeId ? Number(typeId) : undefined} page={page ? Number(page) : 1} defaultSource={defaultSource} />
      </Suspense>
    </>
  )
}

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 py-8">
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
