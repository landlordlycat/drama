import { and, desc, ilike, or, sql } from "drizzle-orm"
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
}

export async function writeOperationLog(input: CreateOperationLogInput): Promise<void> {
  const userName = input.userName?.trim() || "系统"
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

  const keywordWhere = q
    ? or(
        ilike(operationLogs.userName, `%${q}%`),
        ilike(operationLogs.operation, `%${q}%`),
        ilike(operationLogs.content, `%${q}%`),
        ilike(operationLogs.result, `%${q}%`),
      )
    : undefined

  const operationWhere =
    operations.length > 0
      ? or(...operations.map((op) => sql`${operationLogs.operation} = ${op}`))
      : undefined

  const where =
    keywordWhere && operationWhere
      ? and(keywordWhere, operationWhere)
      : (keywordWhere ?? operationWhere)

  const [rows, countRows] = await Promise.all([
    db.select().from(operationLogs).where(where).orderBy(desc(operationLogs.createdAt)).limit(pageSize).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(operationLogs).where(where),
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
