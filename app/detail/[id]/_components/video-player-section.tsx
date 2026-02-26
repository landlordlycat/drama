"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { DramaDetail, Episode } from "@/lib/types/api"
import { Calendar, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/formatDate"
import Artplayer from "artplayer"

interface VideoPlayerSectionProps {
  drama: DramaDetail
}

export default function VideoPlayerSection({ drama }: VideoPlayerSectionProps) {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isWidescreen, setIsWidescreen] = useState(false)
  const [autoPlayNext, setAutoPlayNext] = useState(true)
  const artRef = useRef<Artplayer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const currentEpisode = drama.episodes[currentEpisodeIndex]

  // 初始化播放器
  const initPlayer = useCallback(
    (url: string) => {
      if (!containerRef.current) return

      // 销毁旧实例
      if (artRef.current) {
        artRef.current.destroy()
        artRef.current = null
      }

      if (!url) return

      artRef.current = new Artplayer({
        container: containerRef.current,
        url: url,
        autoplay: true,
        pip: true,
        autoSize: false,
        autoMini: true,
        screenshot: true,
        setting: true,
        loop: false,
        flip: true,
        playbackRate: true,
        aspectRatio: true,
        fullscreen: true,
        fullscreenWeb: true,
        subtitleOffset: true,
        miniProgressBar: true,
        mutex: true,
        backdrop: true,
        playsInline: true,
        autoPlayback: true,
        airplay: true,
        theme: "#6C5CE7",
        lang: navigator.language.toLowerCase(),
        moreVideoAttr: {
          crossOrigin: "anonymous",
        },
        controls: [
          {
            name: "prev-episode",
            position: "left",
            html: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>',
            tooltip: "上一集",
            click: function () {
              if (currentEpisodeIndex > 0) {
                setCurrentEpisodeIndex((prev) => prev - 1)
              }
            },
          },
          {
            name: "next-episode",
            position: "left",
            html: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>',
            tooltip: "下一集",
            click: function () {
              if (currentEpisodeIndex < drama.episodes.length - 1) {
                setCurrentEpisodeIndex((prev) => prev + 1)
              }
            },
          },
          {
            name: "auto-next",
            position: "right",
            html: `<span style="display: flex; align-items: center; gap: 4px; font-size: 12px; padding: 0 8px;">
                    自动下一集
                    <span style="width: 32px; height: 18px; background: ${autoPlayNext ? "#3498DB" : "#666"}; border-radius: 9px; position: relative; transition: all 0.2s;">
                      <span style="width: 14px; height: 14px; background: white; border-radius: 50%; position: absolute; top: 2px; ${autoPlayNext ? "right: 2px;" : "left: 2px;"} transition: all 0.2s;"></span>
                    </span>
                  </span>`,
            tooltip: autoPlayNext ? "关闭自动连播" : "开启自动连播",
            click: function () {
              setAutoPlayNext((prev) => !prev)
            },
          },
        ],
        settings: [
          {
            html: "播放速度",
            selector: [
              { html: "0.5x", value: 0.5 },
              { html: "0.75x", value: 0.75 },
              { html: "正常", value: 1, default: true },
              { html: "1.25x", value: 1.25 },
              { html: "1.5x", value: 1.5 },
              { html: "2x", value: 2 },
            ],
            onSelect: function (item) {
              if (artRef.current) {
                artRef.current.playbackRate = item.value
              }
              return item.html
            },
          },
        ],
      })

      // 视频结束时的处理
      artRef.current.on("video:ended", () => {
        if (autoPlayNext && currentEpisodeIndex < drama.episodes.length - 1) {
          setCurrentEpisodeIndex((prev) => prev + 1)
        }
      })
    },
    [autoPlayNext, currentEpisodeIndex, drama.episodes.length],
  )

  // 切换集数时重新初始化播放器
  useEffect(() => {
    if (currentEpisode?.url) {
      initPlayer(currentEpisode.url)
    }
    return () => {
      if (artRef.current) {
        artRef.current.destroy()
        artRef.current = null
      }
    }
  }, [currentEpisode?.url, initPlayer])

  // 更新自动下一集按钮状态
  useEffect(() => {
    if (artRef.current) {
      artRef.current.controls.update({
        name: "auto-next",
        html: `<span style="display: flex; align-items: center; gap: 4px; font-size: 12px; padding: 0 8px;">
                自动下一集
                <span style="width: 32px; height: 18px; background: ${autoPlayNext ? "#3498DB" : "#666"}; border-radius: 9px; position: relative; transition: all 0.2s;">
                  <span style="width: 14px; height: 14px; background: white; border-radius: 50%; position: absolute; top: 2px; ${autoPlayNext ? "right: 2px;" : "left: 2px;"} transition: all 0.2s;"></span>
                </span>
              </span>`,
        tooltip: autoPlayNext ? "关闭自动连播" : "开启自动连播",
      })
    }
  }, [autoPlayNext])

  return (
    <div className="flex flex-col space-y-6">
      {/* 标题与控制栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">{drama.title}</h1>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {currentEpisode?.name || `第${currentEpisodeIndex + 1}集`} / 共{drama.total || drama.episodes.length}集
          </span>
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 transition-all duration-300`}>
        {/* 左侧：播放器与简介 */}
        <div className={`lg:col-span-8 space-y-6`}>
          {/* ArtPlayer 播放器区域 */}
          <div ref={containerRef} className="relative aspect-video w-full bg-black rounded-xl overflow-hidden">
            {!currentEpisode?.url && <div className="absolute inset-0 flex items-center justify-center text-white/50">暂无播放资源</div>}
          </div>

          <div className={`grid grid-cols-1 gap-6`}>
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
        </div>

        {/* 右侧：选集列表 (常规模式) */}
        <div className="lg:col-span-4">
          <EpisodeList episodes={drama.episodes} currentEpisodeIndex={currentEpisodeIndex} onSelect={setCurrentEpisodeIndex} total={drama.total} />
        </div>
      </div>
    </div>
  )
}

function EpisodeList({ episodes, currentEpisodeIndex, onSelect, total }: { episodes: Episode[]; currentEpisodeIndex: number; onSelect: (index: number) => void; total: number }) {
  return (
    <div className="bg-card border rounded-2xl p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">选集播放</h3>
        <span className="text-xs text-muted-foreground">共{total || episodes.length}集</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3 max-h-150 overflow-y-auto pr-2 no-scrollbar">
        {episodes.map((episode, i) => (
          <Button
            key={i}
            variant={i === currentEpisodeIndex ? "default" : "outline"}
            className={`h-12 text-sm font-medium rounded-xl transition-all ${i === currentEpisodeIndex ? "" : "hover:bg-muted"}`}
            onClick={() => onSelect(i)}
          >
            {episode.name.replace("第", "").replace("集", "") || i + 1}
          </Button>
        ))}
      </div>
    </div>
  )
}
