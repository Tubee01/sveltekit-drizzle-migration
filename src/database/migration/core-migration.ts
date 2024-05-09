import { coreSchema } from "../schema";
import { Migration } from "./migration.abstract";
import type { MigrationConfig } from "./types/migration-config.type";

export class CoreMigration extends Migration {
  constructor(config: MigrationConfig) {
    super(config, coreSchema.schemaName);
  }
  async start(): Promise<void> {
    await super.migrate({
      migrationsFolder: "./drizzle/core-migrations",
    });
  }
}
