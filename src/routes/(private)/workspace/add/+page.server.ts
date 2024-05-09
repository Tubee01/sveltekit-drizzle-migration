import { error, type Actions } from '@sveltejs/kit';
import { z } from 'zod';
import { eq, sql } from 'drizzle-orm';
import {
	workspace,
	drizzleCore,
	userWorkspace,
	user,
	WorkspaceMigration,
	postgresConfig,
	getWorkspaceName
} from '../../../../database';

type WorkSpaceData = typeof workspace.$inferInsert;

const workspaceSchema = z.object({
	name: z.string().min(1),
	ownerId: z.coerce.number()
});

async function createWorkspace(data: WorkSpaceData) {
	try {
		workspaceSchema.parse(data);
	} catch (e) {
		console.log(e.errors);
		throw error(400, e.errors);
	}

	await drizzleCore.insert(workspace).values(data);
	await drizzleCore.transaction(async (tx) => {
		const [ws] = await tx.insert(workspace).values(data).returning({ id: workspace.id });

		await tx.insert(userWorkspace).values({
			workspaceId: ws.id,
			userId: data.ownerId,
			isAdmin: true
		});

		const [dbUser] = await tx.select().from(user).where(eq(user.id, data.ownerId));

		await new WorkspaceMigration(postgresConfig, getWorkspaceName(ws.id)).start();

		await tx
			.execute(
				sql`
				DO $$
				BEGIN
					IF EXISTS (
						SELECT 1
						FROM pg_roles
						WHERE rolname = ${sql.raw("'" + dbUser.email + "'")}
					) THEN
						GRANT USAGE ON SCHEMA ${sql.identifier(getWorkspaceName(ws.id))} TO ${sql.identifier(dbUser.email)};
					ELSE
						CREATE ROLE ${sql.identifier(dbUser.email)}
						WITH NOLOGIN NOSUPERUSER NOINHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
					END IF;
				END
				$$;
				`
			)
			.catch(async (e) => {
				await drizzleCore.execute(
					sql`DROP SCHEMA ${sql.identifier(getWorkspaceName(ws.id))} CASCADE`
				);
				throw e;
			});
	});
}

export const actions: Actions = {
	async default({ request }) {
		const formData = await request.formData();
		const body = Object.fromEntries(formData) as unknown as WorkSpaceData;

		await createWorkspace(body);
	}
};
