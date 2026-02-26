import Modal from "../../_components/modal"
import { dramaApiService } from "@/lib/services/drama-api"
import Image from "next/image"

import { Play, Calendar, FileText } from "lucide-react"
import { formatDate } from "@/lib/formatDate"
import PlayButton from "../../_components/play-button"

export default async function DetailModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const drama = await dramaApiService.getDetail({ id: Number(id) })

  // 格式化日期为 09/12/2025 格式

  return (
    <Modal title={drama.title}>
      <div className="flex flex-col w-full bg-background overflow-hidden h-[85vh]">
        {/* 顶部海报区域 - 固定 */}
        <div className="relative aspect-video w-full overflow-hidden shrink-0">
          <Image src={drama.cover} alt={drama.title} fill className="object-cover" priority />
          {/* 底部渐变和标题 */}
          <div className="absolute inset-x-0 bottom-0 h-full bg-linear-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 pb-4">
            <h2 className="text-xl font-bold text-white leading-tight drop-shadow-md">{drama.title}</h2>
          </div>
        </div>

        {/* 中间滚动区域 - 包含时间、简介 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {/* 更新时间 */}
          <div className="flex items-center gap-3">
            <div className="rounded-lg">
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">更新时间</span>
              <span className="text-base font-medium">{formatDate(drama.time) || "09/12/1975"}</span>
            </div>
          </div>

          {/* 剧情简介 */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h4 className="text-base font-bold">剧情简介</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed text-justify h-30 overflow-y-auto no-scrollbar">{drama.introduction}</p>
          </div>
        </div>

        {/* 底部固定播放控制区域 */}
        <div className="p-6 pt-2 border-t bg-background shrink-0">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold">开始播放</h4>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-sm">共{drama.total || drama.episodes?.length || 0}集</span>
            </div>

            <PlayButton dramaId={drama.id} />
          </div>
        </div>
      </div>
    </Modal>
  )
}
