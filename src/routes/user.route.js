import express from 'express';
const router = express.Router({ mergeParams: true });

import UserController from '../controllers/user.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

router.use('/user/', AuthMiddleware.tokenChecker);

router.get('/user/', UserController.userAccount);

export default router;
