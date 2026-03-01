import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { clearWatchHistory, deleteWatchHistoryItem, listWatchHistory, upsertWatchHistory } from "@/lib/watch-history.server"

interface HistoryBody {
  dramaId?: number
  sourceName?: string
  title?: string
  cover?: string
  total?: number
  year?: string
  time?: string
  lastEpisodeIndex?: number
  lastEpisodeName?: string
  lastPositionSec?: number
  durationSec?: number
  clearAll?: boolean
}

function getSafeDramaId(input: unknown) {
  const dramaId = Number(input)
  return Number.isInteger(dramaId) && dramaId > 0 ? dramaId : null
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const pageRaw = Number(request.nextUrl.searchParams.get("page") || "1")
  const limitRaw = Number(request.nextUrl.searchParams.get("limit") || "20")
  const page = Number.isFinite(pageRaw) ? Math.max(Math.floor(pageRaw), 1) : 1
  const limit = Number.isFinite(limitRaw) ? Math.max(Math.floor(limitRaw), 1) : 20
  const data = await listWatchHistory({
    userId: session.user.id,
    page,
    limit,
  })

  return NextResponse.json({ success: true, data })
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body: HistoryBody = await request.json()
    const dramaId = getSafeDramaId(body.dramaId)
    const title = body.title?.trim() || ""

    if (!dramaId) {
      return NextResponse.json({ error: "dramaId must be a positive integer" }, { status: 400 })
    }
    if (!title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 })
    }

    await upsertWatchHistory({
      userId: session.user.id,
      dramaId,
      sourceName: body.sourceName?.trim() || "",
      title,
      cover: body.cover,
      total: body.total,
      year: body.year,
      time: body.time,
      lastEpisodeIndex: body.lastEpisodeIndex,
      lastEpisodeName: body.lastEpisodeName,
      lastPositionSec: body.lastPositionSec,
      durationSec: body.durationSec,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to upsert watch history", error)
    return NextResponse.json({ error: "Failed to upsert watch history" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body: HistoryBody = await request.json()
    if (body.clearAll) {
      await clearWatchHistory(session.user.id)
      return NextResponse.json({ success: true })
    }

    const dramaId = getSafeDramaId(body.dramaId)
    if (!dramaId) {
      return NextResponse.json({ error: "dramaId must be a positive integer" }, { status: 400 })
    }

    await deleteWatchHistoryItem(session.user.id, dramaId, body.sourceName?.trim() || "")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete watch history", error)
    return NextResponse.json({ error: "Failed to delete watch history" }, { status: 500 })
  }
}
