import fs from "fs";
import path from "path";

export async function loadRoutes(app) {
    fs.readdir(path.join("routes"), (err, files) => {
        if (err) {
            console.error(err);
        }
        files.forEach((file) => {
            import(`../routes/${file}`).then((route) =>
                app.use("/api", route.default)
            );
        });
    });
}
