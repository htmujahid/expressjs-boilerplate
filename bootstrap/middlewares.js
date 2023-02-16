import bodyParser from "body-parser";
import database from "../api/middlewares/database.js";

export function defaultMiddlwares(app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(database);
}
