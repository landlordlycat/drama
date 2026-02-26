import React from "react"
import { dramaApiService } from "@/lib/services/drama-api"
import DramaHeader from "@/components/layout/drama-header"
import VideoPlayerSection from "./_components/video-player-section"

export default async function DramaDetailPage({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) {
  const { id } = await params
  const drama = await dramaApiService.getDetail({ id: Number(id) })

  return (
    <div className="min-h-screen bg-background">
      <DramaHeader />

      <main className="max-w-350 mx-auto px-4 md:px-10 py-6">
        <VideoPlayerSection drama={drama} />
      </main>
    </div>
  )
}
