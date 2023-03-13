import bodyParser from 'body-parser';
import database from '../middlewares/database.middleware.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export function defaultMiddlwares(app) {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(database);
}
