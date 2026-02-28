CREATE TABLE "operation_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" text,
	"user_name" text NOT NULL,
	"operation" text NOT NULL,
	"content" text NOT NULL,
	"result" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "operation_logs_created_at_idx" ON "operation_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "operation_logs_user_name_idx" ON "operation_logs" USING btree ("user_name");--> statement-breakpoint
CREATE INDEX "operation_logs_operation_idx" ON "operation_logs" USING btree ("operation");--> statement-breakpoint
CREATE INDEX "operation_logs_result_idx" ON "operation_logs" USING btree ("result");