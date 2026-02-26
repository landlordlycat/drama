import Image from "next/image"
import { DramaDetail } from "@/lib/types/api"
import Link from "next/link"
interface DramaCardProps {
  item: DramaDetail
}

export default function DramaCard({ item }: DramaCardProps) {
  return (
    <Link href={`/detail/${item.id}`} className="group">
      <article className="flex flex-col relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105 border">
        <div className="relative aspect-[2/3] w-full">
          <Image loading="eager" src={item.cover ?? "/placeholder.png"} alt={item.title} fill className="object-cover" sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 10vw" />

          {/* 渐变蒙版和文字容器 */}
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
            <h3 className="text-sm font-semibold text-white line-clamp-1 ">{item.title}</h3>
            <p className="text-[10px] text-white/70 line-clamp-1 mt-0.5  w-fit rounded-sm px-1 bg-white/10">{item.remarks || "更新至第" + item.total + "集"}</p>
          </div>
        </div>
      </article>
    </Link>
  )
}
