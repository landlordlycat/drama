"use client"

import { Play } from "lucide-react"

interface PlayButtonProps {
  dramaId: number
  sourceName?: string
  episodeIndex?: number
}

export default function PlayButton({ dramaId, sourceName, episodeIndex }: PlayButtonProps) {
  const handlePlay = () => {
    const params = new URLSearchParams()
    const source = sourceName?.trim() || ""

    if (source) params.set("source", source)
    const normalizedEpisodeIndex =
      typeof episodeIndex === "number" && Number.isFinite(episodeIndex) && episodeIndex >= 0 ? Math.floor(episodeIndex) : 0
    params.set("ep", String(normalizedEpisodeIndex))

    const href = params.size > 0 ? `/detail/${dramaId}?${params.toString()}` : `/detail/${dramaId}`
    window.location.assign(href)
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
