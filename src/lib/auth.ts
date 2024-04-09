import { createClient } from "@supabase/supabase-js";
import { Context } from "hono";
import { Env } from "./env";
import { decode, verify } from "hono/jwt";

type BearerTokenResult =
  | { ok: true; username: string }
  | { ok: false; username?: never };

export enum Role {
  ADMIN = "admin",
  USER = "user",
}

export enum AuthType {
  API = "api",
  USER = "user",
}

interface Payload {
  username: string;
  role: Role;
  iat: number;
  exp: number;
}

/**
  Checks if an user is authenticated by verifying the bearer token in the Authorization header.
  @param c The context object.
  @param type If set to "api", it will verify the JWT token, fallback to the session token, otherwise it will only verify the session token.
  @returns A promise that resolves to an object with the result of the authentication check and the username if successful.
*/
export async function isUserAuthenticated(
  c: Context<{ Bindings: Env }>,
  type: AuthType.API | AuthType.USER,
  rank: Role = Role.USER
): Promise<BearerTokenResult> {
  const bearer = c.req.header("Authorization")?.split(" ")[1];

  if (!bearer) {
    return { ok: false };
  }

  if (type === AuthType.API) {
    try {
      await verify(bearer, c.env.JWT_SECRET);

      const { payload } = decode(bearer) as { payload: Payload };
      const isAdmin = payload.role === Role.ADMIN;

      // If the user has the correct privileges for the endpoint and is not blacklistede.
      if (
        (payload.role === rank || isAdmin) &&
        !isBlacklisted(c, payload.username)
      ) {
        return { ok: true, username: payload.username };
      }

      return { ok: false };
    } catch (_) {}
  }

  const { username, role } = await isValidSession(c, bearer);
  if (!username) {
    return { ok: false };
  }

  const isAdmin = getUserRole(c, username) === Role.ADMIN;

  if ((rank === role || isAdmin) && !isBlacklisted(c, username)) {
    return { ok: true, username };
  }

  return { ok: false };
}

/**
 * Checks if the session is valid by verifying the access token with Supabase.
 * @param c the context object
 * @param accessToken the access token
 * @returns the username if the session is valid, otherwise null
 */
async function isValidSession(
  c: Context<{ Bindings: Env }>,
  accessToken: string
): Promise<{ username: string | null; role: Role | null }> {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY);
  const user = await supabase.auth.getUser(accessToken);
  const user_data = user.data.user;
  const username: string | null = user_data?.user_metadata["user_name"];

  if (user_data?.role !== "authenticated" || !username) {
    return { username: null, role: null };
  }

  return {
    username,
    role: getUserRole(c, username),
  };
}

export function getUserRole(
  c: Context<{ Bindings: Env }>,
  username: string
): Role {
  const admins = (c.env.ADMIN_USERNAMES || "").split(",");

  return admins.includes(username) ? Role.ADMIN : Role.USER;
}

function isBlacklisted(
  c: Context<{ Bindings: Env }>,
  username: string
): boolean {
  const blacklisted = (c.env.BLACKLISTED_USERNAMES || "").split(",");
  return blacklisted.includes(username);
}
