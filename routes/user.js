import express from "express";
const router = express.Router({ mergeParams: true });
import { userAccount } from "../api/controllers/user.js";
import { roleAuthorization, tokenChecker } from "../api/middlewares/auth.js";

router.use(tokenChecker, roleAuthorization(["admin", "user"]));

router.get("/user/", async (req, res) => {
    userAccount(req, res);
});

export default router;
