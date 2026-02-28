import { dramaApiService } from "@/lib/services/drama-api"
import DramaCard from "@/app/(main)/_components/drama-card"
import { Search } from "lucide-react"
import { Pagination } from "@/components/pagination"
import { Source } from "@/lib/types/source"

interface SearchResultsListProps {
  query: string
  page?: number
  defaultSource: Source
}

export default async function SearchResultsList({ query, page = 1, defaultSource }: SearchResultsListProps) {
  const res = await dramaApiService.search({ wd: query, page, limit: 24, source: defaultSource.name })

  const details = await Promise.all(res.list.map((item) => dramaApiService.getDetail({ id: item.id })))

  if (details.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
        <Search className="w-16 h-16 mb-4 opacity-10" />
        <h3 className="text-xl font-medium">未找到相关影片</h3>
        <p className="mt-2">尝试更换关键词，或者检查拼写是否正确</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">
          为您找到 <span className="text-primary font-bold">{res.total}</span> 个结果
        </h2>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {details.map((item) => (
          <DramaCard key={item.id} item={item} />
        ))}
      </div>

      <Pagination currentPage={page} totalPages={res.pageCount} basePath="/search" extraParams={{ q: query }} />
    </div>
  )
}
