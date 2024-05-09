import { drizzle } from 'drizzle-orm/postgres-js';
import sql from './postgres-connection';
import * as schema from './schema/core.schema';

const drizzleCore = drizzle(sql, {
	schema
});

export { drizzleCore };
