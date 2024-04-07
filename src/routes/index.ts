import { Hono } from "hono";
import api from "./api";
import { version } from "../../package.json";
import { cache } from "hono/cache";
import { cors } from "hono/cors";

const app = new Hono();

app.get(
  "*",
  cache({
    cacheName: "TOSD",
    cacheControl: "max-age=86400",
  })
);

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PATCH", "DELETE"],
    allowHeaders: ["Authorization", "Content-Type"],
    exposeHeaders: ["Allow"],
    maxAge: 86400,
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.json({ message: `Database is working as expected (v${version})` });
});

app.route("/api", api);

export default app;
