import DramaCard from "@/app/(home)/_components/drama-card"
import { dramaApiService } from "@/lib/services/drama-api"
import { Pagination } from "@/components/pagination"

interface HotListProps {
  page?: number
}

export default async function HotList({ page = 1 }: HotListProps) {
  const res = await dramaApiService.getHot({ page, limit: 24 })
  const details = await Promise.all(res.map((item) => dramaApiService.getDetail({ id: item.id })))

  if (!res.length) {
    return <div className="text-center text-gray-500">暂无数据</div>
  }

  const totalPages = Math.ceil(res.length / 24) || 1

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {details.map((detailItem) => (
          <DramaCard key={detailItem.id} item={detailItem} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} basePath="/hot" />
    </>
  )
}
