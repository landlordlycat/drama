import { pgTable, text, integer, boolean, timestamp, primaryKey, index } from "drizzle-orm/pg-core"

export const categoryVisibility = pgTable(
  "category_visibility",
  {
    sourceName: text("source_name").notNull(),
    typeId: integer("type_id").notNull(),
    isVisible: boolean("is_visible").notNull().default(true),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.sourceName, table.typeId] }),
    index("category_visibility_source_idx").on(table.sourceName),
    index("category_visibility_visible_idx").on(table.isVisible),
  ],
)
