import { router } from "../config/express.js";

router.get("/", (req, res, next) => {
    res.json({ message: "Index World" });
});

export default router;
