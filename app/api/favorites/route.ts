import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { isDramaFavorited, listFavorites, removeFavorite, upsertFavorite } from "@/lib/favorite.server"

interface FavoriteBody {
  dramaId?: number
  sourceName?: string
  title?: string
  cover?: string
  remarks?: string
  total?: number
  year?: string
  time?: string
}

function getSafeDramaId(input: unknown) {
  const dramaId = Number(input)
  return Number.isInteger(dramaId) && dramaId > 0 ? dramaId : null
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const dramaId = getSafeDramaId(request.nextUrl.searchParams.get("dramaId"))
  const sourceName = request.nextUrl.searchParams.get("sourceName")?.trim() || ""

  if (dramaId) {
    const favorited = await isDramaFavorited(session.user.id, dramaId, sourceName)
    return NextResponse.json({ success: true, data: { favorited } })
  }

  const data = await listFavorites(session.user.id)
  return NextResponse.json({ success: true, data })
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body: FavoriteBody = await request.json()
    const dramaId = getSafeDramaId(body.dramaId)
    const title = body.title?.trim() || ""

    if (!dramaId) {
      return NextResponse.json({ error: "dramaId must be a positive integer" }, { status: 400 })
    }
    if (!title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 })
    }

    await upsertFavorite({
      userId: session.user.id,
      dramaId,
      sourceName: body.sourceName?.trim() || "",
      title,
      cover: body.cover,
      remarks: body.remarks,
      total: body.total,
      year: body.year,
      time: body.time,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to add favorite", error)
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body: FavoriteBody = await request.json()
    const dramaId = getSafeDramaId(body.dramaId)
    if (!dramaId) {
      return NextResponse.json({ error: "dramaId must be a positive integer" }, { status: 400 })
    }

    await removeFavorite(session.user.id, dramaId, body.sourceName?.trim() || "")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to remove favorite", error)
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 })
  }
}
