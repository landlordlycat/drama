import { dramaApiService } from "@/lib/services/drama-api"
import DramaHeader from "@/components/layout/drama-header"
import VideoPlayerSection from "./_components/video-player-section"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "短剧详情",
  description: "观看精彩短剧，享受优质内容。",
}

export default function DramaDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    source?: string
  }>
}) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="h-16" />}>
        <DramaHeader />
      </Suspense>

      <main className="max-w-350 mx-auto px-4 md:px-10 py-6">
        <Suspense fallback={<div className="aspect-video bg-muted animate-pulse rounded-lg" />}>
          <DramaContent params={params} searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  )
}

async function DramaContent({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ source?: string }>
}) {
  const { id } = await params
  const { source } = await searchParams
  const defaultSource = await dramaApiService.getDefaultSource()
  const sourceName = source?.trim() || defaultSource.name
  const drama = await dramaApiService.getDetail({ id: Number(id), source: sourceName })
  return <VideoPlayerSection drama={drama} sourceName={sourceName} />
}
