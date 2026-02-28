import { and, eq, sql } from "drizzle-orm"
import { db } from "@/db"
import type { TypeItem } from "@/lib/types/api"
import { categoryVisibility } from "@/db/schema/category-visibility"

export async function getHiddenTypeIds(sourceName: string): Promise<number[]> {
  const rows = await db
    .select({ typeId: categoryVisibility.typeId })
    .from(categoryVisibility)
    .where(and(eq(categoryVisibility.sourceName, sourceName), eq(categoryVisibility.isVisible, false)))

  return rows.map((row) => row.typeId).filter((id) => Number.isInteger(id) && id > 0)
}

export async function setTypeVisible(sourceName: string, typeId: number, visible: boolean): Promise<void> {
  await db
    .insert(categoryVisibility)
    .values({
      sourceName,
      typeId,
      isVisible: visible,
    })
    .onConflictDoUpdate({
      target: [categoryVisibility.sourceName, categoryVisibility.typeId],
      set: {
        isVisible: visible,
        updatedAt: sql`NOW()`,
      },
    })
}

export async function setManyTypesVisible(sourceName: string, typeIds: number[], visible: boolean): Promise<void> {
  const validIds = typeIds.filter((id) => Number.isInteger(id) && id > 0)
  if (validIds.length === 0) return

  const values = validIds.map((typeId) => ({
    sourceName,
    typeId,
    isVisible: visible,
  }))

  await db
    .insert(categoryVisibility)
    .values(values)
    .onConflictDoUpdate({
      target: [categoryVisibility.sourceName, categoryVisibility.typeId],
      set: {
        isVisible: visible,
        updatedAt: sql`NOW()`,
      },
    })
}

export function filterVisibleTypes(types: TypeItem[], hiddenIdSet: Set<number>): TypeItem[] {
  const result: TypeItem[] = []

  for (const type of types) {
    const visibleChildren = (type.children ?? []).filter((child) => !hiddenIdSet.has(child.id))
    const isParentVisible = !hiddenIdSet.has(type.id)

    if (isParentVisible) {
      result.push({
        ...type,
        children: visibleChildren,
      })
      continue
    }

    // If parent is hidden but some children are visible, promote children to top-level.
    for (const child of visibleChildren) {
      result.push({
        ...child,
        children: [],
      })
    }
  }

  return result
}

export function flattenTypeIds(types: TypeItem[]): number[] {
  const ids: number[] = []
  types.forEach((type) => {
    ids.push(type.id)
    type.children?.forEach((child) => ids.push(child.id))
  })
  return ids
}
