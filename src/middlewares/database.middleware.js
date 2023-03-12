import { addSuperAdmin, getUserByEmail } from "../database/queries/users.js";
import process from "../config/dotenv.js";
import { getMongoClient } from "../config/mongodb.js";

export let db;

let superAdminCreated = false;

async function createSuperAdmin() {
    const user = await getUserByEmail(process.env.SEED_ADMIN_EMAIL);
    if (!user) {
        await addSuperAdmin();
    }
    superAdminCreated = true;
}

export default async function database(req, res, next) {
    const dbClient = await getMongoClient();

    if (!db) db = dbClient.db(process.env.MONGODB_DB);
    if (!superAdminCreated) await createSuperAdmin();

    return await next();
}
