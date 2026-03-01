CREATE TABLE "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"drama_id" integer NOT NULL,
	"source_name" text DEFAULT '' NOT NULL,
	"title" text NOT NULL,
	"cover" text,
	"remarks" text,
	"total" integer,
	"year" text,
	"time" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "favorites_user_source_drama_uidx" ON "favorites" USING btree ("user_id","source_name","drama_id");
--> statement-breakpoint
CREATE INDEX "favorites_user_idx" ON "favorites" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "favorites_created_at_idx" ON "favorites" USING btree ("created_at");
