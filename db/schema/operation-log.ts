import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const operationLogs = pgTable(
  "operation_logs",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    userId: text("user_id"),
    userName: text("user_name").notNull(),
    operation: text("operation").notNull(),
    content: text("content").notNull(),
    result: text("result").notNull(),
  },
  (table) => [
    index("operation_logs_created_at_idx").on(table.createdAt),
    index("operation_logs_user_name_idx").on(table.userName),
    index("operation_logs_operation_idx").on(table.operation),
    index("operation_logs_result_idx").on(table.result),
  ],
)

