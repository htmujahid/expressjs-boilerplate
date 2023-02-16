import { router } from "../config/express.js";

router.get("/hello", (req, res) => {
    res.json({ message: "Hello World" });
});

export default router;
