import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getWatchHistoryTrend } from "@/lib/watch-history.server"

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const daysRaw = Number(request.nextUrl.searchParams.get("days") || "7")
  const days = Number.isFinite(daysRaw) ? Math.max(Math.floor(daysRaw), 1) : 7

  try {
    const data = await getWatchHistoryTrend(session.user.id, days)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Failed to get watch trend", error)
    return NextResponse.json({ error: "Failed to get watch trend" }, { status: 500 })
  }
}
