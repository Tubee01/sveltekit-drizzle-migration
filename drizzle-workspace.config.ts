import 'dotenv/config';
import type { Config } from 'drizzle-kit';


export default {
  schema: './src/database/schemas/workspace.schema.ts',
  out: './drizzle/workspace-migrations',
  driver: 'pg',
  dbCredentials: {
    host: String(process.env.PG_HOST),
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: String(process.env.PG_DATABASE),
    port: parseInt(process.env.PG_PORT ?? "5432"),
  },
} satisfies Config;