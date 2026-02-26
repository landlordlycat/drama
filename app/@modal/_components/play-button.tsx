"use client"

import { Play } from "lucide-react"
import { useRouter } from "next/navigation"

interface PlayButtonProps {
  dramaId: number
}

export default function PlayButton({ dramaId }: PlayButtonProps) {
  const router = useRouter()

  const handlePlay = () => {
    // 1. 在新标签页打开详情页
    window.open(`/detail/${dramaId}`, "_blank")
    // 2. 在当前页面返回上一级，从而关闭 Modal
    router.back()
  }

  return (
    <button
      onClick={handlePlay}
      className="w-full h-14 text-lg font-bold rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
    >
      <Play className="w-5 h-5 fill-current" />
      播放
    </button>
  )
}
