import DramaCard from "./drama-card"
import { dramaApiService } from "@/lib/services/drama-api"
import { Pagination } from "@/components/pagination"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface HomeListProps {
  page?: number
}

function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">加载失败</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      <form action="">
        <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          <RefreshCw className="h-4 w-4" />
          重新加载
        </button>
      </form>
    </div>
  )
}

function DramaCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}

async function DramaCardWrapper({ id }: { id: number }) {
  const detail = await dramaApiService.getDetail({ id })
  if (!detail) return <DramaCardSkeleton />
  return <DramaCard item={detail} />
}

export default async function HomeList({ page = 1 }: HomeListProps) {
  let list
  try {
    const res = await dramaApiService.getList({ page, limit: 10 })
    list = res
  } catch (error) {
    const message = error instanceof Error ? error.message : "发生未知错误，请稍后重试"
    return <ErrorDisplay message={message} />
  }

  if (!list?.list || list.list.length === 0) {
    return <ErrorDisplay message="暂无数据" />
  }

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {list.list.map((item) => (
          <DramaCardWrapper key={item.id} id={item.id} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={list.pageCount ?? 1} basePath="/" />
    </>
  )
}
