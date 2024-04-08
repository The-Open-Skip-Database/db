import { AuthType, isUserAuthenticated } from "$lib/auth";
import { Env } from "$lib/env";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { getUserRole } from "$lib/auth";

const auth = new Hono<{ Bindings: Env }>();

auth.post("/", async (c) => {
  const { ok, username } = await isUserAuthenticated(c, AuthType.USER);

  if (!ok) {
    return c.text("", 401);
  }

  const api_key = await sign(
    {
      username,
      role: getUserRole(c, username),
      iat: Math.floor(Date.now() / 1000),
    },
    c.env.JWT_SECRET
  );

  return c.json({ api_key });
});

export default auth;
