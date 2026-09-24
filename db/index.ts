import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let client: ReturnType<typeof postgres> | undefined;

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Copy the Supabase connection string (Session pooler, port 5432) into your environment. See .env.example."
    );
  }

  // Reused across requests within the same isolate; postgres.js manages its own connection pool.
  client ??= postgres(process.env.DATABASE_URL, { prepare: false });

  return drizzle(client, { schema });
}
