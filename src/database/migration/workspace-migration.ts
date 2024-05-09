import { Migration } from "./migration.abstract";
import type { MigrationConfig } from "./types/migration-config.type";

export class WorkspaceMigration extends Migration {
  constructor(config: MigrationConfig, workspace: string) {
    super(config, workspace);
  }
  async start(): Promise<void> {
    await super.migrate({
      migrationsSchema: this.workspace,
      migrationsFolder: "./drizzle/workspace-migrations",
    });
  }

  async hasPendingMigrations(): Promise<boolean> {
    return super.hasPendingMigrations({
      migrationsSchema: this.workspace,
      migrationsFolder: "./drizzle/workspace-migrations",
    });
  }
}
