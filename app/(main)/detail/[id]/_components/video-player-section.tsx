"use client"

import { useState, useCallback } from "react"
import { DramaDetail, Episode } from "@/lib/types/api"
import { Calendar, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/formatDate"
import ArtPlayer from "@/components/player/art-player"
import FavoriteToggle from "./favorite-toggle"

interface VideoPlayerSectionProps {
  drama: DramaDetail
  sourceName: string
}

export default function VideoPlayerSection({ drama, sourceName }: VideoPlayerSectionProps) {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)

  const currentEpisode = drama.episodes[currentEpisodeIndex]

  const handleNextEpisode = useCallback(() => {
    setCurrentEpisodeIndex((prev) => {
      if (prev < drama.episodes.length - 1) {
        return prev + 1
      }
      return prev
    })
  }, [drama.episodes.length])

  const handlePrevEpisode = useCallback(() => {
    setCurrentEpisodeIndex((prev) => {
      if (prev > 0) {
        return prev - 1
      }
      return prev
    })
  }, [])

  const handleSelectEpisode = useCallback((index: number) => {
    setCurrentEpisodeIndex(index)
  }, [])

  const favoriteDrama = {
    id: drama.id,
    title: drama.title,
    cover: drama.cover,
    remarks: drama.remarks,
    total: drama.total,
    year: drama.year,
    time: drama.time,
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">{drama.title}</h1>
          <span className="rounded bg-muted px-2 py-0.5 text-sm text-muted-foreground">
            {currentEpisode?.name || `第 ${currentEpisodeIndex + 1} 集`} / 共 {drama.total || drama.episodes.length} 集
          </span>
        </div>

        <FavoriteToggle sourceName={sourceName} drama={favoriteDrama} className="md:hidden" />
      </div>

      <div className="grid grid-cols-1 gap-8 transition-all duration-300 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <ArtPlayer
            url={currentEpisode?.url || ""}
            onEnded={handleNextEpisode}
            onPrevEpisode={handlePrevEpisode}
            onNextEpisode={handleNextEpisode}
            hasPrev={currentEpisodeIndex > 0}
            hasNext={currentEpisodeIndex < drama.episodes.length - 1}
          />
          <div className="hidden md:flex md:justify-end">
            <FavoriteToggle sourceName={sourceName} drama={favoriteDrama} />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-6 rounded-2xl border bg-card p-8">
              <div className="flex items-center gap-2 text-lg font-bold">
                <FileText className="h-5 w-5 text-primary" />
                <h3>剧情介绍</h3>
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm md:grid-cols-4">
                <div className="space-y-1">
                  <p className="text-muted-foreground">年份:</p>
                  <p className="font-medium">{drama.year || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">更新:</p>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(drama.time) || "-"}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-muted-foreground">剧情简介</p>
                <p className="text-justify text-sm leading-loose text-muted-foreground">{drama.introduction}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <EpisodeList episodes={drama.episodes} currentEpisodeIndex={currentEpisodeIndex} onSelect={handleSelectEpisode} total={drama.total} />
        </div>
      </div>
    </div>
  )
}

function EpisodeList({ episodes, currentEpisodeIndex, onSelect, total }: { episodes: Episode[]; currentEpisodeIndex: number; onSelect: (index: number) => void; total: number }) {
  return (
    <div className="sticky top-24 rounded-2xl border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold">选集播放</h3>
        <span className="text-xs text-muted-foreground">共 {total || episodes.length} 集</span>
      </div>

      <div className="no-scrollbar grid max-h-150 grid-cols-3 gap-3 overflow-y-auto pr-2 sm:grid-cols-4 lg:grid-cols-3">
        {episodes.map((episode, i) => (
          <Button
            key={i}
            variant={i === currentEpisodeIndex ? "default" : "outline"}
            className={`h-12 rounded-xl text-sm font-medium transition-all ${i === currentEpisodeIndex ? "" : "hover:bg-muted"}`}
            onClick={() => onSelect(i)}
          >
            {episode.name || i + 1}
          </Button>
        ))}
      </div>
    </div>
  )
}
