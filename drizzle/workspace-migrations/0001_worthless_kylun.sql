CREATE TABLE IF NOT EXISTS "test" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_test_name_unique" ON "test" ("name");