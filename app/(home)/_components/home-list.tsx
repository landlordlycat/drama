import DramaCard from "./drama-card"
import { dramaApiService } from "@/lib/services/drama-api"
import { Pagination } from "@/components/pagination"

interface HomeListProps {
  page?: number
}

export default async function HomeList({ page = 1 }: HomeListProps) {
  const res = await dramaApiService.getList({ page, limit: 24 })
  const details = await Promise.all(res.list.map((item) => dramaApiService.getDetail({ id: item.id })))

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {details.map((detailItem) => (
          <DramaCard key={detailItem.id} item={detailItem} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={res.pageCount} basePath="/" />
    </>
  )
}
