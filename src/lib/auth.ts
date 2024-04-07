import { createClient } from "@supabase/supabase-js";
import { Context } from "hono";
import { Env } from "./env";

type BearerTokenResult =
  | { ok: true; username: string }
  | { ok: false; username?: never };

export async function isValidBearerToken(
  c: Context<{ Bindings: Env }>
): Promise<BearerTokenResult> {
  const bearer = c.req.header("Authorization")?.split(" ")[1];

  if (!bearer) {
    return { ok: false };
  }

  const username = await isValidSession(c, bearer);
  if (!username) {
    return { ok: false };
  }

  return { ok: true, username };
}

async function isValidSession(
  c: Context<{ Bindings: Env }>,
  accessToken: string
) {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY);
  return (await supabase.auth.getUser(accessToken)).data.user?.user_metadata[
    "user_name"
  ];
}
