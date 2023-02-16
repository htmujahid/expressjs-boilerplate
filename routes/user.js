import { router } from "../config/express.js";
import { getUserByEmail } from "../api/db/users.js";

router.get("/user/:email", async (req, res) => {
    const { email } = req.params;
    res.json({
        user: await getUserByEmail(email),
    });
});

export default router;
