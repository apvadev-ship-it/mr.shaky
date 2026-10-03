import { createClient } from "@insforge/sdk";

// User-scoped InsForge client. The anon key carries no privileges of its own:
// row access is decided by RLS against the signed-in user, so this is safe to
// reach the browser. Privileged work belongs in createAdminClient on the
// server, reading the admin API key from a server-only env var.
const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;

if (!baseUrl || !anonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_INSFORGE_URL or NEXT_PUBLIC_INSFORGE_ANON_KEY; see .env.example",
  );
}

export const insforge = createClient({ baseUrl, anonKey });
