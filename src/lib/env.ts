export type Env = {
  TURSO_DATABASE_URL: string;
  TURSO_AUTH_TOKEN: string;
  TMDB_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  JWT_SECRET: string;
  ADMIN_USERNAMES: string | null;
  BLACKLISTED_USERNAMES: string | null;
};
