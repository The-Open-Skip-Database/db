import api from "./api";
import { cache } from "hono/cache";
import { cors } from "hono/cors";
import { OpenAPIHono } from "@hono/zod-openapi";
import docs from "./docs/index";

const app = new OpenAPIHono();

app.get(
  "/api/*",
  cache({
    cacheName: "TOSD",
    cacheControl: "max-age=86400",
  })
);

app.use(
  "/api/* ",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PATCH", "DELETE"],
    allowHeaders: ["Authorization", "Content-Type"],
    exposeHeaders: ["Allow"],
    maxAge: 86400,
    credentials: true,
  })
);

app.route("/", docs);

app.route("/api", api);

export default app;
