import DramaHeader from "@/components/layout/drama-header"
import { dramaApiService } from "@/lib/services/drama-api"
import { Suspense } from "react"
import CategoryFilter from "./_components/category-filter"
import CategoryList from "./_components/category-list"
import { Skeleton } from "@/components/ui/skeleton"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { filterVisibleTypes, flattenTypeIds, getHiddenTypeIds } from "@/lib/category-visibility.server"

export const metadata: Metadata = {
  title: "分类浏览",
  description: "按类型浏览内容",
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
  const typesRes = await dramaApiService.getTypes({ source: defaultSource.name })

  const hiddenIds = await getHiddenTypeIds(defaultSource.name)
  const visibleTypes = filterVisibleTypes(typesRes.types, new Set(hiddenIds))
  const visibleTypeIds = new Set(flattenTypeIds(visibleTypes))
  const firstVisibleTypeId = visibleTypes[0]?.id

  if (firstVisibleTypeId) {
    const currentId = Number(typeId)
    if (!typeId || !Number.isInteger(currentId) || !visibleTypeIds.has(currentId)) {
      redirect(`/categories?typeId=${firstVisibleTypeId}`)
    }
  }

  return (
    <>
      <Suspense>
        <CategoryFilter types={visibleTypes} />
      </Suspense>

      {typeId && visibleTypeIds.has(Number(typeId)) ? (
        <Suspense fallback={<CategorySkeleton />}>
          <CategoryList typeId={Number(typeId)} page={page ? Number(page) : 1} defaultSource={defaultSource} />
        </Suspense>
      ) : (
        <div className="py-10 text-sm text-muted-foreground">暂无可显示分类</div>
      )}
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
