import { Hono } from "hono";
import { z } from "zod";
import { buildClient } from "$db/db";
import { seriesTable, seriesSchema, Series } from "$db/schema";
import { and, eq } from "drizzle-orm";
import { Env } from "$lib/env";
import { areTimesValid } from "$lib/tmdb";
import { AuthType, isUserAuthenticated, Role } from "$lib/auth";

const series = new Hono<{ Bindings: Env }>();

series.get("/:tmdb", async (c) => {
  let tmdb_id: number;
  let season: number;
  let episode: number;

  if (!c.req.param("tmdb")) {
    return c.json({ message: "No TMDB id provided." }, 400);
  }
  if (!c.req.query("season")) {
    return c.json({ message: "No season provided." }, 400);
  }
  if (!c.req.query("episode")) {
    return c.json({ message: "No episode provided." }, 400);
  }

  try {
    tmdb_id = await z.coerce.number().parseAsync(c.req.param("tmdb"));
    season = await z.coerce.number().parseAsync(c.req.query("season"));
    episode = await z.coerce.number().parseAsync(c.req.query("episode"));
  } catch (e) {
    return c.json({ message: "Invalid TMDB id, season or episode." }, 400);
  }

  const db = buildClient(c.env);

  const res = await db
    .select({
      intro_start: seriesTable.intro_start,
      intro_end: seriesTable.intro_end,
      outro_start: seriesTable.outro_start,
    })
    .from(seriesTable)
    .where(
      and(
        eq(seriesTable.tmdb_id, tmdb_id),
        eq(seriesTable.season, season),
        eq(seriesTable.episode, episode)
      )
    );

  if (res.length === 0) {
    return c.json({ message: "No results found." }, 404);
  }

  return c.json({
    intro_start: res[0].intro_start,
    intro_end: res[0].intro_end,
    outro_start: res[0].outro_start,
  });
});

series.post("/", async (c) => {
  let body: Series;

  const { ok, username } = await isUserAuthenticated(c, AuthType.API);

  if (!ok) {
    return c.text("", 401);
  }

  try {
    body = seriesSchema.parse(await c.req.json());
  } catch (e) {
    return c.json({ message: "Invalid body." }, 400);
  }

  if (!(await areTimesValid(body, c.env.TMDB_API_KEY))) {
    return c.json({ message: "Invalid times." }, 400);
  }

  const db = buildClient(c.env);
  const episode = await db
    .select({
      id: seriesTable.id,
    })
    .from(seriesTable)
    .where(
      and(
        eq(seriesTable.tmdb_id, body.tmdb_id),
        eq(seriesTable.season, body.season),
        eq(seriesTable.episode, body.episode)
      )
    );

  if (episode.length > 0) {
    return c.json({ message: "Episode already exists." }, 409);
  }

  await db.insert(seriesTable).values({
    intro_start: body.intro_start,
    intro_end: body.intro_end,
    outro_start: body.outro_start,
    created_by: username,
    tmdb_id: body.tmdb_id,
    season: body.season,
    episode: body.episode,
  });

  return c.json({ message: "OK!" });
});

series.patch("/", async (c) => {
  let body: Series;

  const { ok, username } = await isUserAuthenticated(
    c,
    AuthType.API,
    Role.ADMIN
  );

  if (!ok) {
    return c.text("", 401);
  }

  try {
    body = seriesSchema.parse(await c.req.json());
  } catch (e) {
    return c.json({ message: "Invalid body." }, 400);
  }

  if (!(await areTimesValid(body, c.env.TMDB_API_KEY))) {
    return c.json({ message: "Invalid times." }, 400);
  }

  const db = buildClient(c.env);
  const res = await db
    .update(seriesTable)
    .set({
      intro_start: body.intro_start,
      intro_end: body.intro_end,
      outro_start: body.outro_start,
      updated_by: username,
    })
    .where(
      and(
        eq(seriesTable.tmdb_id, body.tmdb_id),
        eq(seriesTable.season, body.season),
        eq(seriesTable.episode, body.episode)
      )
    );

  if (res.rowsAffected === 0) {
    return c.json({ message: "No rows affected." }, 409);
  }

  return c.json({ message: "OK!" });
});

series.delete("/:tmdb", async (c) => {
  let tmdb_id: number;
  let season: number;
  let episode: number;

  const { ok } = await isUserAuthenticated(c, AuthType.API, Role.ADMIN);

  if (!ok) {
    return c.text("", 401);
  }

  if (!c.req.param("tmdb")) {
    return c.json({ message: "No TMDB id provided." }, 400);
  }
  if (!c.req.query("season")) {
    return c.json({ message: "No season provided." }, 400);
  }
  if (!c.req.query("episode")) {
    return c.json({ message: "No episode provided." }, 400);
  }

  try {
    tmdb_id = await z.coerce.number().parseAsync(c.req.param("tmdb"));
    season = await z.coerce.number().parseAsync(c.req.query("season"));
    episode = await z.coerce.number().parseAsync(c.req.query("episode"));
  } catch (e) {
    return c.json({ message: "Invalid TMDB id, season or episode." }, 400);
  }

  const db = buildClient(c.env);
  const res = await db
    .delete(seriesTable)
    .where(
      and(
        eq(seriesTable.tmdb_id, tmdb_id),
        eq(seriesTable.season, season),
        eq(seriesTable.episode, episode)
      )
    );

  if (res.rowsAffected === 0) {
    return c.json({ message: "No rows affected." }, 404);
  }

  return c.json({ message: "OK!" });
});

export default series;
