import { Hono } from "hono";
import api from "./api";
import { version } from "../../package.json";
import { cache } from "hono/cache";

const app = new Hono();

app.get(
  "*",
  cache({
    cacheName: "TOSD",
    cacheControl: "max-age=86400",
  })
);

app.get("/", (c) => {
  return c.json({ message: `Database is working as expected (v${version})` });
});

app.route("/api", api);

export default app;
