import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { drizzleCore, userWorkspace } from '../../../database';

export const load = async ({ cookies }) => {
	const userId = Number(cookies.get('userId'));
	if (!userId) {
		return redirect(302, '/login');
	}

	const userWorkspaces = await drizzleCore
		.select()
		.from(userWorkspace)
		.where(eq(userWorkspace.userId, userId));

	if (userWorkspaces.length === 0) {
		return redirect(302, '/workspace/add');
	}
};
