CREATE SCHEMA "core";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."user_workspace" (
	"workspace_id" integer,
	"user_id" integer,
	"is_admin" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "core"."workspace" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_user_email" ON "core"."user" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_workspace_unique" ON "core"."user_workspace" ("workspace_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_workspace_name" ON "core"."workspace" ("name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."user_workspace" ADD CONSTRAINT "user_workspace_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "core"."workspace"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "core"."user_workspace" ADD CONSTRAINT "user_workspace_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "core"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
