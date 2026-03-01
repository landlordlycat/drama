import { user } from "@/auth-schema"
import { index, integer, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"

export const watchHistory = pgTable(
  "watch_history",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    dramaId: integer("drama_id").notNull(),
    sourceName: text("source_name").notNull().default(""),
    title: text("title").notNull(),
    cover: text("cover"),
    total: integer("total"),
    year: text("year"),
    time: text("time"),
    lastEpisodeIndex: integer("last_episode_index").notNull().default(0),
    lastEpisodeName: text("last_episode_name"),
    lastPositionSec: integer("last_position_sec").notNull().default(0),
    durationSec: integer("duration_sec"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("watch_history_user_source_drama_uidx").on(table.userId, table.sourceName, table.dramaId),
    index("watch_history_user_updated_idx").on(table.userId, table.updatedAt),
  ],
)
