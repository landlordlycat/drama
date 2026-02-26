import Modal from "../../_components/modal"
import { dramaApiService } from "@/lib/services/drama-api"
import Image from "next/image"

export default async function DetailModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const drama = await dramaApiService.getDetail({ id: Number(id) })

  return (
    <Modal title={drama.title}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative aspect-2/3 w-full md:w-64 shrink-0 overflow-hidden rounded-lg">
          <Image src={drama.cover} alt={drama.title} fill className="object-cover" />
        </div>
        <div className="flex flex-col space-y-4">
          <div>
            <span className="text-sm text-muted-foreground">
              {drama.year} · {drama.typeName} · {drama.area}
            </span>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">简介</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{drama.introduction}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">主演: </span>
              <span className="text-muted-foreground">{drama.actors}</span>
            </div>
            <div>
              <span className="font-medium">导演: </span>
              <span className="text-muted-foreground">{drama.director}</span>
            </div>
            <div>
              <span className="font-medium">状态: </span>
              <span className="text-muted-foreground">{drama.remarks}</span>
            </div>
            <div>
              <span className="font-medium">豆瓣评分: </span>
              <span className="text-muted-foreground">{drama.doubanScore || "暂无"}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
