import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

/**
 * RakshAI database client (Drizzle ORM / PostgreSQL).
 * Connected to hosted Postgres (e.g. Neon) via DATABASE_URL.
 */

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is missing.");
}

declare global {
  // eslint-disable-next-line no-var
  var __rakshai_pg_client__: postgres.Sql | undefined;
}

const client =
  global.__rakshai_pg_client__ ??
  postgres(connectionString, {
    prepare: false, // Required for serverless transaction/session pooling (Neon)
  });

if (process.env.NODE_ENV !== "production") {
  global.__rakshai_pg_client__ = client;
}

export const db = drizzle(client, { schema });
export { schema };
