import { error, type Actions } from '@sveltejs/kit';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { drizzleCore, user } from '../../../database';

type RegistrationData = typeof user.$inferInsert;
const registrationSchema = z
	.object({
		name: z.string().min(1),
		email: z.string().email(),
		password: z.string().min(3),
		confirmPassword: z.string().min(3)
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	});

async function register(data: RegistrationData) {
	try {
		registrationSchema.parse(data);
	} catch (e) {
		console.error(e.errors);
		throw error(400, e.errors);
	}

	const userData = {
		name: data.name,
		email: data.email,
		password: await bcrypt.hash(data.password, 10)
	} satisfies RegistrationData;

	await drizzleCore.insert(user).values(userData);
}

export const actions: Actions = {
	async default({ request }) {
		const formData = await request.formData();
		const body = Object.fromEntries(formData) as unknown as RegistrationData;

		await register(body);
	}
};
