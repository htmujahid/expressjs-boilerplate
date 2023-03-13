import express from 'express';
const router = express.Router({ mergeParams: true });

import userController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

router.use('/user/', authMiddleware.tokenChecker);

router.get('/user/', userController.userAccount);

export default router;
