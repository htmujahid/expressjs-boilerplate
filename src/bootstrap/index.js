import { defaultMiddlwares } from "./middlewares.js";
import { loadRoutes } from "./routes.js";

export function start(app) {
    defaultMiddlwares(app);
    loadRoutes(app);
}
