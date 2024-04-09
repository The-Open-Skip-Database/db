import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const movieDoc = new OpenAPIHono();

const getMoviesRoute = createRoute({
  method: "get",
  path: "/{tmdb_id}",
  summary: "Get an existing movie",
  description: "Returns the outro_start time for a given movie.",
  tags: ["movie"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      tmdb_id: z.number(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(
            z.object({
              outro_start: z.number(),
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

movieDoc.openapi(getMoviesRoute, (c) => {
  return c.json([
    {
      tmdb_id: 550,
      outro_start: 30,
    },
    {
      tmdb_id: 680,
      outro_start: 20,
    },
  ]);
});

const postMovieRoute = createRoute({
  method: "post",
  path: "/ ",
  summary: "Add a new movie",
  description:
    "Adds a new entry to the database with the tmdb_id and outro_start time.",
  tags: ["movie"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            tmdb_id: z.number(),
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
      description: "The movie was added successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Invalid body",
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
      description: "No rows affected, the movie already exists",
    },
  },
});

movieDoc.openapi(postMovieRoute, (c) => {
  return c.json({ message: "OK!" });
});

const patchMovieRoute = createRoute({
  method: "patch",
  path: "/",
  summary: "Update an existing movie",
  description:
    "Update the outro_start time for a movie, this is an admin only action.",
  tags: ["movie"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      tmdb_id: z.number(),
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            tmdb_id: z.number(),
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
      description: "The movie was updated successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Invalid body",
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
      description: "No rows affected, the movie does not exist",
    },
  },
});

movieDoc.openapi(patchMovieRoute, (c) => {
  return c.json({ message: "OK!" });
});

const deleteMovieRoute = createRoute({
  method: "delete",
  path: "/{tmdb_id}",
  summary: "Delete an existing movie",
  description:
    "Delete a movie from the database, this is an admin only action.",
  tags: ["movie"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      tmdb_id: z.number(),
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
      description: "The movie was deleted successfully",
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
      description: "No rows affected, the movie does not exist",
    },
  },
});

movieDoc.openapi(deleteMovieRoute, (c) => {
  return c.json({ message: "OK!" });
});

export default movieDoc;
