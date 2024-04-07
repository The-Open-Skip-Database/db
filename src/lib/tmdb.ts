import { Series } from "$db/schema";

interface TMDBResponse {
  runtime: number;
}

const TMDB_BASE = "https://api.themoviedb.org/3";

export async function getMovieRuntime(
  tmdb: number,
  api_key: string
): Promise<number> {
  const res = await fetch(`${TMDB_BASE}/movie/${tmdb}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${api_key}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch movie data.");
  }

  const data = (await res.json()) as TMDBResponse;
  return data.runtime * 60;
}

async function getEpisodeRuntime(
  tmdb: number,
  season: number,
  episode: number,
  api_key: string
): Promise<number> {
  const res = await fetch(
    `${TMDB_BASE}/tv/${tmdb}/season/${season}/episode/${episode}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${api_key}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch episode data.");
  }

  const data = (await res.json()) as TMDBResponse;
  return data.runtime * 60;
}

export async function areTimesValid(
  body: Series,
  api_key: string
): Promise<boolean> {
  const runtime = await getEpisodeRuntime(
    body.tmdb_id,
    body.season,
    body.episode,
    api_key
  );

  return (
    body.intro_start < body.intro_end &&
    body.intro_end < body.outro_start &&
    body.outro_start < runtime
  );
}
