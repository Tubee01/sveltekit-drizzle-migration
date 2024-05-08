import type { MigrationConfig as DrizzleMigrationConfig } from "drizzle-orm/migrator";
import { drizzle as drizzlePostgresJs } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

export type MigrationConfig = postgres.Options<
  Record<string, postgres.PostgresType>
>;

export abstract class Migration {
  protected db: ReturnType<typeof postgres>;
  protected drizzle: ReturnType<typeof drizzlePostgresJs>;
  constructor(
    private readonly config: MigrationConfig,
    protected readonly workspace: string
  ) {
    this.db = postgres({
      ...this.config,
      connection: {
        search_path: this.workspace,
      },
      max: 1,
    });

    this.drizzle = drizzlePostgresJs(this.db);
  }
  abstract start(): Promise<void>;

  protected async migrate(config: DrizzleMigrationConfig): Promise<void> {
    await migrate(this.drizzle, config).finally(() => this.db.end());
  }
}
