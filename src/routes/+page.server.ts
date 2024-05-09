import type { Actions } from '@sveltejs/kit';
import { CoreMigration, DatabaseMigration, postgresConfig } from '../database';

export const actions: Actions = {
	async default({ request }) {
		const formData = await request.formData();
		const updateWorkspaces = !!formData.get('updateWorkspaces');
		if (updateWorkspaces) {
			await DatabaseMigration.start(postgresConfig);
			return;
		}
		await new CoreMigration(postgresConfig).start();
	}
};
