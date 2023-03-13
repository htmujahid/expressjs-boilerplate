import express from 'express';
const router = express.Router({ mergeParams: true });

router.get('/hello', (req, res) => {
    res.json({ message: 'Hello World' });
});

export default router;
