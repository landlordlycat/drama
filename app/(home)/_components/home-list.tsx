import DramaCard from "./drama-card"
import { dramaApiService } from "@/lib/services/drama-api"

export default async function HomeList() {
  const res = await dramaApiService.getList({})
  const details = await Promise.all(res.list.map((item) => dramaApiService.getDetail({ id: 114532 })))

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {details.map((detailItem) => (
        <DramaCard key={detailItem.id} item={detailItem} />
      ))}
    </div>
  )
}
