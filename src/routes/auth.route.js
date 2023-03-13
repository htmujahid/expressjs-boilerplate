import express from 'express';
const router = express.Router({ mergeParams: true });
import authController from '../controllers/auth.controller.js';
import validatorMiddleware from '../middlewares/validators.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { validationSchemas } from '../validation/index.js';

router.post('/auth/login', validatorMiddleware.validateBody(validationSchemas.loginForm), authController.userLogin);

router.post(
    '/auth/register',
    validatorMiddleware.validateBody(validationSchemas.registerForm),
    authController.userRegister,
);

router.post('/auth/verify-token', authMiddleware.tokenChecker, (req, res) => {
    res.status(200).json({ message: 'Token is valid' });
});

export default router;
