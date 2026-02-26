import DramaCard from "./drama-card"
import { dramaApiService } from "@/lib/services/drama-api"
import { Pagination } from "@/components/pagination"
import { AlertCircle, RefreshCw } from "lucide-react"
import { DetailResponse, ListResponse } from "@/lib/types/api"

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

async function fetchHomeData(page: number): Promise<{
  list: ListResponse | null
  details: (DetailResponse | null)[]
  error: string | null
}> {
  try {
    const res = await dramaApiService.getList({ page, limit: 24 })
    const details = await Promise.all((res.list ?? []).map((item) => dramaApiService.getDetail({ id: item.id }).catch(() => null)))
    return { list: res, details, error: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : "发生未知错误，请稍后重试"
    return { list: null, details: [], error: message }
  }
}

export default async function HomeList({ page = 1 }: HomeListProps) {
  const { list, details, error } = await fetchHomeData(page)

  if (error) {
    return <ErrorDisplay message={error} />
  }

  const validDetails = details.filter((d): d is NonNullable<typeof d> => d !== null)

  if (validDetails.length === 0) {
    return <ErrorDisplay message="暂无数据" />
  }

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {validDetails.map((detailItem) => (
          <DramaCard key={detailItem.id} item={detailItem} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={list?.pageCount ?? 1} basePath="/" />
    </>
  )
}
