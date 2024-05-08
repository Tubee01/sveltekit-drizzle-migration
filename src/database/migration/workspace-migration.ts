import { Migration, type MigrationConfig } from "./migration.abstract";

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
}
