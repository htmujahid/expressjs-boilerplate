import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default {
    env: {
        APP_PORT: process.env.APP_PORT,
        MONGODB_URI: process.env.MONGODB_URI,
        MONGODB_DB: process.env.MONGODB_DB,
        SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL,
        SEED_ADMIN_PASS: process.env.SEED_ADMIN_PASS,
        JWT_SECRET: process.env.JWT_SECRET,
    },
};
