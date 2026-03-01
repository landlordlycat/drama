import { Suspense } from "react"
import type { Metadata } from "next"
import DramaHeader from "@/components/layout/drama-header"
import { dramaApiService } from "@/lib/services/drama-api"
import VideoPlayerSection from "./_components/video-player-section"

const fallbackMetadata: Metadata = {
  title: "短剧详情",
  description: "观看精彩短剧，享受优质内容。",
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ source?: string }>
}): Promise<Metadata> {
  try {
    const { id } = await params
    const { source } = await searchParams
    const defaultSource = await dramaApiService.getDefaultSource()
    const sourceName = source?.trim() || defaultSource.name
    const drama = await dramaApiService.getDetail({ id: Number(id), source: sourceName })

    return {
      title: drama.title || fallbackMetadata.title,
      description: drama.introduction?.trim() || fallbackMetadata.description,
    }
  } catch {
    return fallbackMetadata
  }
}

export default function DramaDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ source?: string }>
}) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="h-16" />}>
        <DramaHeader />
      </Suspense>

      <main className="mx-auto max-w-350 px-4 py-6 md:px-10">
        <Suspense fallback={<div className="aspect-video animate-pulse rounded-lg bg-muted" />}>
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
