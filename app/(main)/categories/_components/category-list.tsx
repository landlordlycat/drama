import { dramaApiService } from "@/lib/services/drama-api"
import DramaCard from "@/app/(main)/_components/drama-card"
import { Pagination } from "@/components/pagination"
import { Source } from "@/lib/types/source"

interface CategoryListProps {
  typeId?: number
  page?: number
  defaultSource?: Source
}

export default async function CategoryList({ typeId, page = 1, defaultSource }: CategoryListProps) {
  const res = await dramaApiService.getList({ typeId, page, limit: 10, source: defaultSource?.name ?? "" })

  const details = await Promise.all(res.list.map((item) => dramaApiService.getDetail({ id: item.id })))

  if (details.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p>暂无相关影片</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 py-8">
        {details.map((item) => (
          <DramaCard key={item.id} item={item} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={res.pageCount} basePath="/categories" extraParams={{ typeId }} />
    </>
  )
}
