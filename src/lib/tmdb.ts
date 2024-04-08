import { Series } from "$db/schema";

interface TMDBResponse {
  runtime: number;
}

const TMDB_BASE = "https://api.themoviedb.org/3";

/**
 * Fetches the runtime of a movie from the TMDB API.
 * @param tmdb the TMDB id of the movie
 * @param api_key the TMDB API key
 * @returns the runtime of the movie in seconds
 */
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
    return 0;
  }

  const data = (await res.json()) as TMDBResponse;
  return data.runtime * 60;
}

/**
 * Fetches the runtime of an episode from the TMDB API.
 * @param tmdb the TMDB id of the series
 * @param season the season number
 * @param episode the episode number
 * @param api_key the TMDB API key
 * @returns the runtime of the episode in seconds
 */
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
    return 0;
  }

  const data = (await res.json()) as TMDBResponse;
  return data.runtime * 60;
}

/**
 * Checks if the times provided are valid for a series.
 * @param body a series object
 * @param api_key the TMDB API key
 * @returns a boolean indicating if the times are valid
 */
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
