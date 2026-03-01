import { user } from "@/auth-schema"
import { index, integer, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"

export const favorites = pgTable(
  "favorites",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    dramaId: integer("drama_id").notNull(),
    sourceName: text("source_name").notNull().default(""),
    title: text("title").notNull(),
    cover: text("cover"),
    remarks: text("remarks"),
    total: integer("total"),
    year: text("year"),
    time: text("time"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("favorites_user_source_drama_uidx").on(table.userId, table.sourceName, table.dramaId),
    index("favorites_user_idx").on(table.userId),
    index("favorites_created_at_idx").on(table.createdAt),
  ],
)
