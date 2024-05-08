import { coreSchema } from "../schemas";
import { Migration, MigrationConfig } from "./migration.abstract";

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
