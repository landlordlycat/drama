"use client"

import "@vidstack/react/player/styles/base.css"
import "@vidstack/react/player/styles/plyr/theme.css"

import { MediaPlayer, MediaProvider, Poster, Track, useMediaRemote, useMediaStore, type MediaPlayerInstance } from "@vidstack/react"
import { PlyrLayout, plyrLayoutIcons } from "@vidstack/react/player/layouts/plyr"
import { useEffect, useRef } from "react"

interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  onEnded?: () => void
  onNext?: () => void
  onPrev?: () => void
  autoPlay?: boolean
}

export default function VideoPlayer({ src, poster, title, onEnded, onNext, onPrev, autoPlay = true }: VideoPlayerProps) {
  const player = useRef<MediaPlayerInstance>(null)

  // 监听播放结束，自动下一集
  useEffect(() => {
    if (onEnded) {
      const unbind = player.current?.subscribe(({ ended }) => {
        if (ended) onEnded()
      })
      return unbind
    }
  }, [onEnded])

  return (
    <div className="w-full h-full bg-black rounded-xl overflow-hidden shadow-2xl">
      <MediaPlayer ref={player} title={title} src={src} crossOrigin playsInline autoPlay={autoPlay} onEnded={onEnded} className="w-full h-full">
        <MediaProvider>
          {poster && <Poster src={poster} alt={title} className="absolute inset-0 block h-full w-full rounded-md object-cover opacity-0 transition-opacity data-visible:opacity-100" />}
        </MediaProvider>

        {/* 使用 Plyr 样式布局，它包含了播放/暂停、快进、时间、音量、全屏等所有功能 */}
        <PlyrLayout
          icons={plyrLayoutIcons}
          // 这里可以自定义一些 Plyr 的配置
        />
      </MediaPlayer>
    </div>
  )
}
