import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const authDoc = new OpenAPIHono();

const authRoute = createRoute({
  method: "post",
  path: "/",
  summary: "Get an API key",
  tags: ["auth"],
  request: {
    headers: z.object({
      Authorization: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            api_key: z.string(),
          }),
        },
      },
      description: "Returns an API key",
    },
    401: {
      description: "Unauthorized",
    },
  },
});

authDoc.openapi(authRoute, (c) => {
  return c.json({
    api_key: "APIKEY",
  });
});

export default authDoc;
