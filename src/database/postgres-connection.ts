import postgres from "postgres";
import 'dotenv/config';

const postgresConfig = {
  port: parseInt(process.env.PG_PORT ?? "5432"),
  database: process.env!.PG_DATABASE as string,
  username: process.env!.PG_USER as string,
  password: process.env!.PG_PASSWORD as string,
} as const;

const sql = postgres(postgresConfig);

export default sql;
export { postgresConfig };
