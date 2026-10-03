import { createAdminClient } from "@insforge/sdk";

// SERVER-ONLY. The InsForge API key is a full-access admin credential: it runs as
// project_admin and therefore bypasses RLS. It must never reach the browser, so it
// is read from INSFORGE_API_KEY (no NEXT_PUBLIC_ prefix). For user-scoped access
// from client code use lib/insforge.ts, which carries only the anon key.
//
// The orders / payment tables are locked down (no grants for anon or authenticated,
// RLS on with no policies), so this client is the only way app code reaches them.

// Postgres SQLSTATE for unique_violation. The SDK RETURNS errors as { data, error }
// instead of throwing, so a duplicate insert must be detected by inspecting
// error.code — a try/catch will not see it.
export const PG_UNIQUE_VIOLATION = "23505";

let admin: ReturnType<typeof createAdminClient> | undefined;

export function getAdminDb() {
  const baseUrl = process.env.INSFORGE_URL;
  const apiKey = process.env.INSFORGE_API_KEY;
  if (!baseUrl || !apiKey) {
    throw new Error(
      "INSFORGE_URL / INSFORGE_API_KEY are not set. See .env.example.",
    );
  }

  // Reused across requests within the same isolate; the client is stateless.
  admin ??= createAdminClient({ baseUrl, apiKey });
  return admin.database;
}
