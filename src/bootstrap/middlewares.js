import bodyParser from 'body-parser';
import database from '../middlewares/database.middleware.js';

export function defaultMiddlwares(app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(database);
}
