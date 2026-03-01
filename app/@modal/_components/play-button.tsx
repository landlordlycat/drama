"use client"

import { Play } from "lucide-react"
import { useRouter } from "next/navigation"

interface PlayButtonProps {
  dramaId: number
  sourceName?: string
}

export default function PlayButton({ dramaId, sourceName }: PlayButtonProps) {
  const router = useRouter()

  const handlePlay = () => {
    const source = sourceName?.trim() || ""
    const href = source ? `/detail/${dramaId}?source=${encodeURIComponent(source)}` : `/detail/${dramaId}`
    window.open(href, "_blank")
    router.back()
  }

  return (
    <button
      onClick={handlePlay}
      className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-zinc-900 text-lg font-bold text-white transition-transform hover:bg-zinc-800 active:scale-95"
    >
      <Play className="h-5 w-5 fill-current" />
      Play
    </button>
  )
}
