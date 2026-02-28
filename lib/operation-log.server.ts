import { and, count, desc, eq, ilike, inArray, isNull, or } from "drizzle-orm"
import { db } from "@/db"
import { operationLogs } from "@/db/schema/operation-log"

export interface CreateOperationLogInput {
  userId?: string | null
  userName?: string | null
  operation: string
  content: string
  result: "SUCCESS" | "FAILURE"
}

export interface ListOperationLogsInput {
  q?: string
  page?: number
  pageSize?: number
  operations?: string[]
  userId?: string
  userName?: string
}

export async function writeOperationLog(input: CreateOperationLogInput): Promise<void> {
  const userName = input.userName?.trim() || "system"
  await db.insert(operationLogs).values({
    userId: input.userId ?? null,
    userName,
    operation: input.operation,
    content: input.content,
    result: input.result,
  })
}

export async function listOperationLogs(input: ListOperationLogsInput) {
  const pageSize = Math.min(Math.max(input.pageSize ?? 20, 1), 100)
  const page = Math.max(input.page ?? 1, 1)
  const offset = (page - 1) * pageSize
  const q = input.q?.trim()
  const operations = (input.operations ?? []).filter(Boolean)
  const userId = input.userId?.trim()
  const userName = input.userName?.trim()

  const keywordWhere = q
    ? or(
        ilike(operationLogs.userName, `%${q}%`),
        ilike(operationLogs.operation, `%${q}%`),
        ilike(operationLogs.content, `%${q}%`),
        ilike(operationLogs.result, `%${q}%`),
      )
    : undefined

  const operationWhere = operations.length > 0 ? inArray(operationLogs.operation, operations) : undefined

  const ownerWhere = userId
    ? or(eq(operationLogs.userId, userId), and(isNull(operationLogs.userId), eq(operationLogs.userName, userName || "")))
    : (userName ? eq(operationLogs.userName, userName) : undefined)

  const whereClauses = [ownerWhere, keywordWhere, operationWhere].filter(Boolean)
  const where = whereClauses.length === 0 ? undefined : whereClauses.length === 1 ? whereClauses[0] : and(...whereClauses)

  const [rows, countRows] = await Promise.all([
    db.select().from(operationLogs).where(where).orderBy(desc(operationLogs.createdAt)).limit(pageSize).offset(offset),
    db.select({ count: count() }).from(operationLogs).where(where),
  ])

  const total = Number(countRows[0]?.count ?? 0)
  return {
    rows,
    page,
    pageSize,
    total,
    totalPages: Math.max(Math.ceil(total / pageSize), 1),
  }
}
