import postgres from 'postgres';
import { CoreMigration } from './core-migration';
import type { MigrationConfig } from './types/migration-config.type';
import { WORKSPACE_PREFIX } from '../utils/get-workspace-name';
import { WorkspaceMigration } from './workspace-migration';

export class DatabaseMigration {
	public static async start(config: MigrationConfig): Promise<void> {
		const coreMigration = new CoreMigration(config);
		await coreMigration.start();

		const workspaces = await DatabaseMigration.getWorkspaces(config);
		for (const workspace of workspaces) {
			const workspaceMigration = new WorkspaceMigration(config, workspace);
			const hasPendingMigrations = await workspaceMigration.hasPendingMigrations();
			if (hasPendingMigrations) {
				await workspaceMigration.start();
			}
		}
	}

	private static async getWorkspaces(config: MigrationConfig): Promise<string[]> {
		const db = postgres({
			...config
		});

		// get all schemas that start with 'workspace_'
		const workspaces = await db`
            SELECT schema_name
            FROM information_schema.schemata
            WHERE schema_name LIKE ${db`${WORKSPACE_PREFIX}`} || '%'
        `;

		return workspaces.map((workspace) => workspace.schema_name);
	}
}
