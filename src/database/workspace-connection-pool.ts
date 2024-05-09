import postgres from 'postgres';

const clients: { [key: string]: ReturnType<typeof postgres> } = {};

export function getClient(name: string) {
	if (clients[name]) {
		return clients[name];
	} else {
		return null;
	}
}

export async function createPool(config: postgres.Options<Record<string, postgres.PostgresType>>) {
	if (!config.user) {
		throw new Error('User is required');
	}

	if (getClient(config.user)) {
		throw new Error('Pool already exists');
	}
	clients[config.user] = postgres(config);
	return clients[config.user];
}

export function getCreateIfNotExistClient(
	config: postgres.Options<Record<string, postgres.PostgresType>>
) {
	if (!config.user) {
		throw new Error('User is required');
	}

	const client = getClient(config.user);
	if (client) {
		return client;
	} else {
		return createPool(config);
	}
}

export async function endAll() {
	await Promise.all(Object.values(clients).map((client) => client.end()));
}
