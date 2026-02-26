import { dramaApiService } from "@/lib/services/drama-api"
import DramaCard from "@/app/(home)/_components/drama-card"

interface CategoryListProps {
  typeId?: number
  page?: number
}

export default async function CategoryList({ typeId, page = 1 }: CategoryListProps) {
  const res = await dramaApiService.getList({ typeId, page, limit: 24 }) // 减少单次加载数量以提升速度

  // 获取每个剧集的详情以补充封面和集数信息
  const details = await Promise.all(res.list.map((item) => dramaApiService.getDetail({ id: item.id })))

  if (details.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p>暂无相关影片</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 py-8">
      {details.map((item) => (
        <DramaCard key={item.id} item={item} />
      ))}
    </div>
  )
}
