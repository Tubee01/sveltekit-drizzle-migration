import type { Actions } from '@sveltejs/kit';
import { CoreMigration, WorkspaceMigration } from '../database';
import { postgresConfig } from '../database/postgres-connection';

export const actions: Actions = {
	async default({ request }) {
		const formData = await request.formData();
		const workspace = String(formData.get('workspace'));

		await new CoreMigration(postgresConfig).start();
		await new WorkspaceMigration(postgresConfig, workspace).start();
	}
};
