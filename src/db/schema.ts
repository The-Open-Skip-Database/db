import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { z } from "zod";

export const moviesTable = sqliteTable("movies", {
  tmdb_id: integer("tmdb_id").unique().primaryKey().notNull(),
  outro_start: integer("outro_start").notNull(),
  created_by: text("created_by").notNull(),
  updated_by: text("updated_by"),
});

export const seriesTable = sqliteTable("series", {
  id: integer("id").unique().primaryKey().notNull(),
  tmdb_id: integer("tmdb_id").notNull(),
  season: integer("season").notNull(),
  episode: integer("episode").notNull(),
  intro_start: integer("intro_start").notNull(),
  intro_end: integer("intro_end").notNull(),
  outro_start: integer("outro_start").notNull(),
  created_by: text("created_by").notNull(),
  updated_by: text("updated_by"),
});

export const movieSchema = z.object({
  tmdb_id: z.coerce.number().positive(),
  outro_start: z.coerce.number().positive(),
  created_by: z.string(),
  updated_by: z.string().optional(),
});

export const seriesSchema = z.object({
  tmdb_id: z.coerce.number().positive(),
  season: z.coerce.number().positive(),
  episode: z.coerce.number().positive(),
  intro_start: z.coerce.number().positive(),
  intro_end: z.coerce.number().positive(),
  outro_start: z.coerce.number().positive(),
  created_by: z.string(),
  updated_by: z.string().optional(),
});

export type Movie = z.infer<typeof movieSchema>;
export type Series = z.infer<typeof seriesSchema>;
