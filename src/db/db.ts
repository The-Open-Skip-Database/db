import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/web";
import { Env } from "$lib/env";

export function buildClient(env: Env) {
  return drizzle(
    createClient({
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    })
  );
}
