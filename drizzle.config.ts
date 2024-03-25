import type { Config } from "drizzle-kit";
import { config } from "dotenv";

config();

const env = process.env as any;

export default {
  schema: "./src/db/schema.ts",
  out: "./migrations",
  driver: "turso",
  dbCredentials: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
  strict: true,
} satisfies Config;
