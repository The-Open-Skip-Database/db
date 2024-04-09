import { OpenAPIHono } from "@hono/zod-openapi";
import authDoc from "./auth";
import movieDoc from "./movie";
import seriesDoc from "./series";
import { apiReference } from "@scalar/hono-api-reference";
import { version } from "../../../package.json";

const docs = new OpenAPIHono();

docs.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    version,
    title: "The Open Skip Database",
    description:
      "A database for storing intro and outro timings for TV shows and movies.",
  },
});

docs.get(
  "/",
  apiReference({
    spec: {
      url: "/openapi.json",
    },
    pageTitle: "The Open Skip Database",
    theme: "deepSpace",
  })
);

docs.route("/demo/api/auth", authDoc);
docs.route("/demo/api/movie", movieDoc);
docs.route("/demo/api/series", seriesDoc);

export default docs;
