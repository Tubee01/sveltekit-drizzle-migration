import { error, redirect, type Actions } from '@sveltejs/kit';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { drizzleCore, user } from '../../../database';

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(3)
});

export const actions: Actions = {
	async default({ request, cookies }) {
		const formData = await request.formData();
		let body = Object.fromEntries(formData) as unknown as z.infer<typeof loginSchema>;
		try {
			body = loginSchema.parse(body);
		} catch (e) {
			console.error(e.errors);
			throw error(400, e.errors);
		}

		const [userData] = await drizzleCore.select().from(user).where(eq(user.email, body.email));

		if (!userData) {
			throw error(401, 'Invalid email or password');
		}

		const passwordMatch = await bcrypt.compare(body.password, userData.password);

		if (!passwordMatch) {
			throw error(401, 'Invalid email or password');
		}

        cookies.set('userId', String(userData.id), {
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        });

		return redirect(302, '/workspace');
	}
};
