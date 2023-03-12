import express from "express";
const router = express.Router({ mergeParams: true });

router.get("/", (req, res, next) => {
    res.json({ message: "Index World" });
});

export default router;
