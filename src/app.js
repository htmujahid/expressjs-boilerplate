import { app } from "./config/express.js";
import { start } from "./bootstrap/index.js";
import process from "./config/dotenv.js";

const PORT = process.env.APP_PORT || 3000;

start(app);

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
