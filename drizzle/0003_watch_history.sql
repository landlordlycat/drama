CREATE TABLE "watch_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"drama_id" integer NOT NULL,
	"source_name" text DEFAULT '' NOT NULL,
	"title" text NOT NULL,
	"cover" text,
	"total" integer,
	"year" text,
	"time" text,
	"last_episode_index" integer DEFAULT 0 NOT NULL,
	"last_episode_name" text,
	"last_position_sec" integer DEFAULT 0 NOT NULL,
	"duration_sec" integer,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "watch_history" ADD CONSTRAINT "watch_history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "watch_history_user_source_drama_uidx" ON "watch_history" USING btree ("user_id","source_name","drama_id");
--> statement-breakpoint
CREATE INDEX "watch_history_user_updated_idx" ON "watch_history" USING btree ("user_id","updated_at");
