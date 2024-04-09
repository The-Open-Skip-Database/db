import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const seriesDoc = new OpenAPIHono();

const getSeriesRoute = createRoute({
  method: "get",
  path: "/{tmdb_id}?season={season}&episode={episode}",
  summary: "Get an existing episode",
  description: "Returns the intro and outro times for a given episode.",
  tags: ["series"],
  request: {
    params: z.object({
      tmdb_id: z.number(),
      season: z.number(),
      episode: z.number(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(
            z.object({
              outro_start: z.number(),
              intro_start: z.number().nullable(),
              intro_end: z.number().nullable(),
            })
          ),
        },
      },
      description: "Returns the outro_start (in seconds) for a given TMDB id",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Invalid TMDB id",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "No results found",
    },
  },
});

seriesDoc.openapi(getSeriesRoute, (c) => {
  return c.json([
    {
      outro_start: 30,
      intro_start: 10,
      intro_end: 20,
    },
    {
      outro_start: 30,
      intro_start: 10,
      intro_end: 20,
    },
  ]);
});

const postSeriesRoute = createRoute({
  method: "post",
  path: "/",
  summary: "Add a new episode",
  description: "Adds a new episode to the database.",
  tags: ["series"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            tmdb_id: z.number(),
            season: z.number(),
            episode: z.number(),
            intro_start: z.number().optional(),
            intro_end: z.number().optional(),
            outro_start: z.number(),
          }),
        },
      },
    },
    headers: z.object({
      Authorization: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "The episode was added successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Invalid body or times",
    },
    401: {
      description: "Unauthorized",
    },
    409: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Episode already exists",
    },
  },
});

seriesDoc.openapi(postSeriesRoute, (c) => {
  return c.json({ message: "OK!" }, 200);
});

const patchSeriesRoute = createRoute({
  method: "patch",
  path: "/",
  summary: "Update an existing episode",
  description:
    "Updates an existing episode in the database with the new values.",
  tags: ["series"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            tmdb_id: z.number(),
            season: z.number(),
            episode: z.number(),
            intro_start: z.number().optional(),
            intro_end: z.number().optional(),
            outro_start: z.number(),
          }),
        },
      },
    },
    headers: z.object({
      Authorization: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "The episode was updated successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Invalid body or times",
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Episode not found",
    },
  },
});

seriesDoc.openapi(patchSeriesRoute, (c) => {
  return c.json({ message: "OK!" }, 200);
});

const deleteSeriesRoute = createRoute({
  method: "delete",
  path: "/{tmdb_id}?season={season}&episode={episode}",
  summary: "Delete an existing episode",
  description:
    "Deletes an existing entry in the database, this is an admin only action.",
  tags: ["series"],
  request: {
    params: z.object({
      tmdb_id: z.number(),
      season: z.number(),
      episode: z.number(),
    }),
    headers: z.object({
      Authorization: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "The episode was deleted successfully",
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Episode not found",
    },
  },
});

seriesDoc.openapi(deleteSeriesRoute, (c) => {
  return c.json({ message: "OK!" }, 200);
});

export default seriesDoc;
