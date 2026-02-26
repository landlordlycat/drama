"use client"

import React, { useState } from "react"
import { DramaDetail, Episode } from "@/lib/types/api"
import { Play, Calendar, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/formatDate"

interface VideoPlayerSectionProps {
  drama: DramaDetail
}

export default function VideoPlayerSection({ drama }: VideoPlayerSectionProps) {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const currentEpisode = drama.episodes[currentEpisodeIndex]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* 左侧：播放器与简介 */}
      <div className="lg:col-span-8 space-y-6">
        {/* 标题栏移动到这里，方便同步集数 */}
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl font-bold">{drama.title}</h1>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {currentEpisode?.name || `第${currentEpisodeIndex + 1}集`} / 共{drama.total || drama.episodes.length}集
          </span>
        </div>

        {/* 真实播放器区域 */}
        <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden group">
         
          {currentEpisode?.url ?
            <iframe src={currentEpisode.url} className="w-full h-full border-none" allowFullScreen allow="autoplay; encrypted-media" />
          : <div className="absolute inset-0 flex items-center justify-center text-white/50">暂无播放资源</div>}
        </div>

        {/* 剧集介绍卡片 */}
        <div className="bg-card border rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-2 text-lg font-bold">
            <FileText className="w-5 h-5 text-primary" />
            <h3>剧情介绍</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">年份:</p>
              <p className="font-medium">{drama.year || "1900"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">更新:</p>
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(drama.time) || "09/12/2025"}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-bold">剧情简介:</p>
            <p className="text-sm text-muted-foreground leading-loose text-justify">{drama.introduction}</p>
          </div>
        </div>
      </div>

      {/* 右侧：选集列表 */}
      <div className="lg:col-span-4">
        <div className="bg-card border rounded-2xl p-6 sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">选集播放</h3>
            <span className="text-xs text-muted-foreground">共{drama.total || drama.episodes.length}集</span>
          </div>

          <div className="grid grid-cols-3 gap-3 max-h-150 overflow-y-auto pr-2 no-scrollbar">
            {drama.episodes.map((episode, i) => (
              <Button
                key={i}
                variant={i === currentEpisodeIndex ? "default" : "outline"}
                className={`h-12 text-sm font-medium rounded-xl transition-all ${i === currentEpisodeIndex ? "" : "hover:bg-muted"}`}
                onClick={() => setCurrentEpisodeIndex(i)}
              >
                {episode.name.replace("第", "").replace("集", "") || "第" + i + 1 + "集"}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
