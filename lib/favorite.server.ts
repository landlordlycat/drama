import { and, desc, eq, sql } from "drizzle-orm"
import { db } from "@/db"
import { favorites } from "@/db/schema/favorite"

export interface CreateFavoriteInput {
  userId: string
  dramaId: number
  sourceName?: string
  title: string
  cover?: string | null
  remarks?: string | null
  total?: number | null
  year?: string | null
  time?: string | null
}

function normalizeText(value?: string | null): string | null {
  const next = value?.trim()
  return next ? next : null
}

export async function upsertFavorite(input: CreateFavoriteInput): Promise<void> {
  const sourceName = input.sourceName?.trim() || ""
  await db
    .insert(favorites)
    .values({
      userId: input.userId,
      dramaId: input.dramaId,
      sourceName,
      title: input.title.trim(),
      cover: normalizeText(input.cover),
      remarks: normalizeText(input.remarks),
      total: Number.isInteger(input.total) ? input.total : null,
      year: normalizeText(input.year),
      time: normalizeText(input.time),
    })
    .onConflictDoUpdate({
      target: [favorites.userId, favorites.sourceName, favorites.dramaId],
      set: {
        title: input.title.trim(),
        cover: normalizeText(input.cover),
        remarks: normalizeText(input.remarks),
        total: Number.isInteger(input.total) ? input.total : null,
        year: normalizeText(input.year),
        time: normalizeText(input.time),
        updatedAt: sql`NOW()`,
      },
    })
}

export async function removeFavorite(userId: string, dramaId: number, sourceName = ""): Promise<void> {
  await db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.dramaId, dramaId), eq(favorites.sourceName, sourceName)))
}

export async function isDramaFavorited(userId: string, dramaId: number, sourceName = ""): Promise<boolean> {
  const rows = await db
    .select({ id: favorites.id })
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.dramaId, dramaId), eq(favorites.sourceName, sourceName)))
    .limit(1)

  return rows.length > 0
}

export async function listFavorites(userId: string) {
  return db.select().from(favorites).where(eq(favorites.userId, userId)).orderBy(desc(favorites.createdAt))
}
