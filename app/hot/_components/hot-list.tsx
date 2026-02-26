import DramaCard from "@/app/(home)/_components/drama-card"
import { dramaApiService } from "@/lib/services/drama-api"

export default async function HotList() {
  const res = await dramaApiService.getHot({})
  console.log(res)
  const details = await Promise.all(res.map((item) => dramaApiService.getDetail({ id: item.id })))
  if (!res.length) {
    return <div className="text-center text-gray-500">暂无数据</div>
  }
  return <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">{details && details.map((detailItem) => <DramaCard key={detailItem.id} item={detailItem} />)}</div>
}
