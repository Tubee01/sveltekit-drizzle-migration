import type postgres from "postgres";

export type MigrationConfig = postgres.Options<
  Record<string, postgres.PostgresType>
>;
