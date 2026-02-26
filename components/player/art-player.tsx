"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import Artplayer from "artplayer"

interface ArtPlayerProps {
  url: string
  onEnded?: () => void
  onPrevEpisode?: () => void
  onNextEpisode?: () => void
  hasPrev?: boolean
  hasNext?: boolean
  theme?: string
  getInstance?: (art: Artplayer) => void
}

export default function ArtPlayer({ url, onEnded, onPrevEpisode, onNextEpisode, hasPrev = true, hasNext = true, theme = "#6C5CE7", getInstance }: ArtPlayerProps) {
  const artRef = useRef<Artplayer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [autoPlayNext, setAutoPlayNext] = useState(true)

  const initPlayer = useCallback(() => {
    if (!containerRef.current || !url) return

    // 销毁旧实例
    if (artRef.current) {
      artRef.current.destroy()
      artRef.current = null
    }

    // 检测是否为移动端
    const isMobile = window.innerWidth < 768

    artRef.current = new Artplayer({
      container: containerRef.current,
      url: url,
      autoplay: true,
      pip: !isMobile,
      autoSize: false,
      autoMini: !isMobile,
      screenshot: !isMobile,
      setting: !isMobile,
      loop: false,
      flip: !isMobile,
      playbackRate: true,
      aspectRatio: !isMobile,
      fullscreen: true,
      fullscreenWeb: !isMobile,
      subtitleOffset: !isMobile,
      miniProgressBar: true,
      mutex: true,
      backdrop: true,
      playsInline: true,
      autoPlayback: true,
      airplay: !isMobile,
      theme: theme,
      lang: navigator.language.toLowerCase(),
      moreVideoAttr: {
        crossOrigin: "anonymous",
      },
      controls: isMobile
        ? [
            // 移动端精简控制栏
            hasPrev && onPrevEpisode
              ? {
                  name: "prev-episode",
                  position: "left",
                  html: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>',
                  tooltip: "上一集",
                  click: onPrevEpisode,
                }
              : null,
            hasNext && onNextEpisode
              ? {
                  name: "next-episode",
                  position: "left",
                  html: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>',
                  tooltip: "下一集",
                  click: onNextEpisode,
                }
              : null,
          ].filter((control): control is NonNullable<typeof control> => Boolean(control))
        : [
            // 桌面端完整控制栏
            hasPrev && onPrevEpisode
              ? {
                  name: "prev-episode",
                  position: "left",
                  html: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>',
                  tooltip: "上一集",
                  click: onPrevEpisode,
                }
              : null,
            hasNext && onNextEpisode
              ? {
                  name: "next-episode",
                  position: "left",
                  html: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>',
                  tooltip: "下一集",
                  click: onNextEpisode,
                }
              : null,
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
          ].filter((control): control is NonNullable<typeof control> => Boolean(control)),
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

    if (getInstance) {
      getInstance(artRef.current)
    }

    // 视频结束时的处理
    artRef.current.on("video:ended", () => {
      if (autoPlayNext && onEnded) {
        onEnded()
      }
    })
  }, [url, autoPlayNext, theme, hasPrev, hasNext, onPrevEpisode, onNextEpisode, onEnded, getInstance])

  // 初始化播放器
  useEffect(() => {
    initPlayer()
    return () => {
      if (artRef.current) {
        artRef.current.destroy()
        artRef.current = null
      }
    }
  }, [initPlayer])

  // 更新自动下一集按钮状态（仅桌面端）
  useEffect(() => {
    if (artRef.current && window.innerWidth >= 768) {
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
    <div ref={containerRef} className="relative aspect-video w-full bg-black rounded-xl overflow-hidden z-[100]">
      {!url && <div className="absolute inset-0 flex items-center justify-center text-white/50">暂无播放资源</div>}
    </div>
  )
}
