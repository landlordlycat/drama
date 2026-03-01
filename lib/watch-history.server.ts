import { and, count, desc, eq, sql } from "drizzle-orm"
import { db } from "@/db"
import { watchHistory } from "@/db/schema/watch-history"

export interface UpsertWatchHistoryInput {
  userId: string
  dramaId: number
  sourceName?: string
  title: string
  cover?: string | null
  total?: number | null
  year?: string | null
  time?: string | null
  lastEpisodeIndex?: number
  lastEpisodeName?: string | null
  lastPositionSec?: number
  durationSec?: number | null
}

interface ListWatchHistoryInput {
  userId: string
  page?: number
  limit?: number
}

export interface WatchTrendPoint {
  date: string
  count: number
}

function normalizeText(value?: string | null): string | null {
  const next = value?.trim()
  return next ? next : null
}

function normalizeInt(value: unknown, fallback = 0) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.max(Math.floor(n), 0)
}

export async function upsertWatchHistory(input: UpsertWatchHistoryInput): Promise<void> {
  const sourceName = input.sourceName?.trim() || ""
  await db
    .insert(watchHistory)
    .values({
      userId: input.userId,
      dramaId: input.dramaId,
      sourceName,
      title: input.title.trim(),
      cover: normalizeText(input.cover),
      total: Number.isInteger(input.total) ? input.total : null,
      year: normalizeText(input.year),
      time: normalizeText(input.time),
      lastEpisodeIndex: normalizeInt(input.lastEpisodeIndex),
      lastEpisodeName: normalizeText(input.lastEpisodeName),
      lastPositionSec: normalizeInt(input.lastPositionSec),
      durationSec: Number.isInteger(input.durationSec) ? input.durationSec : null,
    })
    .onConflictDoUpdate({
      target: [watchHistory.userId, watchHistory.sourceName, watchHistory.dramaId],
      set: {
        title: input.title.trim(),
        cover: normalizeText(input.cover),
        total: Number.isInteger(input.total) ? input.total : null,
        year: normalizeText(input.year),
        time: normalizeText(input.time),
        lastEpisodeIndex: normalizeInt(input.lastEpisodeIndex),
        lastEpisodeName: normalizeText(input.lastEpisodeName),
        lastPositionSec: normalizeInt(input.lastPositionSec),
        durationSec: Number.isInteger(input.durationSec) ? input.durationSec : null,
        updatedAt: sql`NOW()`,
      },
    })
}

export async function listWatchHistory(input: ListWatchHistoryInput) {
  const limit = Math.min(Math.max(input.limit ?? 20, 1), 50)
  const page = Math.max(input.page ?? 1, 1)
  const offset = (page - 1) * limit

  const [rows, countRows] = await Promise.all([
    db.select().from(watchHistory).where(eq(watchHistory.userId, input.userId)).orderBy(desc(watchHistory.updatedAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(watchHistory).where(eq(watchHistory.userId, input.userId)),
  ])

  const total = Number(countRows[0]?.count ?? 0)
  const totalPages = Math.max(Math.ceil(total / limit), 1)

  return {
    rows,
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
  }
}

export async function deleteWatchHistoryItem(userId: string, dramaId: number, sourceName = ""): Promise<void> {
  await db.delete(watchHistory).where(and(eq(watchHistory.userId, userId), eq(watchHistory.dramaId, dramaId), eq(watchHistory.sourceName, sourceName)))
}

export async function clearWatchHistory(userId: string): Promise<void> {
  await db.delete(watchHistory).where(eq(watchHistory.userId, userId))
}

export async function getWatchHistoryTrend(userId: string, days = 7): Promise<WatchTrendPoint[]> {
  const safeDays = Math.min(Math.max(Math.floor(days), 1), 30)
  const rows = (await db.execute(sql`
    SELECT TO_CHAR((updated_at AT TIME ZONE 'UTC')::date, 'YYYY-MM-DD') AS date,
           COUNT(*)::int AS count
    FROM watch_history
    WHERE user_id = ${userId}
      AND updated_at >= NOW() - (${safeDays - 1} * INTERVAL '1 day')
    GROUP BY 1
    ORDER BY 1 ASC
  `)) as unknown as { rows: Array<{ date: string; count: number | string }> }

  const countByDate = new Map<string, number>()
  for (const row of rows.rows ?? []) {
    countByDate.set(row.date, Number(row.count) || 0)
  }

  const result: WatchTrendPoint[] = []
  for (let i = safeDays - 1; i >= 0; i -= 1) {
    const d = new Date()
    d.setUTCDate(d.getUTCDate() - i)
    const date = d.toISOString().slice(0, 10)
    result.push({
      date,
      count: countByDate.get(date) || 0,
    })
  }

  return result
}
