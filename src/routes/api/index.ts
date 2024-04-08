import { Hono } from "hono";
import movie from "./movie";
import { Env } from "$lib/env";
import series from "./series";
import auth from "./auth";

const api = new Hono<{ Bindings: Env }>();

api.route("/movie", movie);
api.route("/series", series);
api.route("/auth", auth);

export default api;
