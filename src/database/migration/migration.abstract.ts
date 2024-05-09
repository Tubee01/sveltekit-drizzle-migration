import { readMigrationFiles, type MigrationConfig as DrizzleMigrationConfig } from 'drizzle-orm/migrator';
import { drizzle as drizzlePostgresJs } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres, { type RowList } from 'postgres';
import type { MigrationConfig } from './types/migration-config.type';

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
				search_path: this.workspace
			},
			max: 1
		});

		this.drizzle = drizzlePostgresJs(this.db);
	}
	abstract start(): Promise<void>;

	protected async migrate(config: DrizzleMigrationConfig): Promise<void> {
		await migrate(this.drizzle, config).finally(() => this.db.end());
	}

	protected async hasPendingMigrations(config: DrizzleMigrationConfig): Promise<boolean> {
		const migrationHashes = readMigrationFiles(config).filter((migration) => migration.hash);
		const appliedMigrations = await this.db<RowList<Record<"hash",string>[]>>`SELECT hash FROM ${this.db("__drizzle_migrations")}`;
		const appliedHashes = appliedMigrations.map((row) => row.hash);

		return migrationHashes.some((meta) => !appliedHashes.includes(meta.hash));

	}
}
