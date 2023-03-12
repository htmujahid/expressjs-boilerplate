import express from 'express';
const router = express.Router({ mergeParams: true });
import userController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

router.use(authMiddleware.tokenChecker, authMiddleware.roleAuthorization(['admin', 'user']));

router.get('/user/', userController.userAccount);

export default router;
