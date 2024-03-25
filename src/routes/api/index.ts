import { Hono } from "hono";
import movie from "./movie";
import { Env } from "$lib/env";
import series from "./series";

const api = new Hono<{ Bindings: Env }>();

api.route("/movie", movie);
api.route("/series", series);

export default api;
