import express from 'express';
const router = express.Router({ mergeParams: true });
import AuthController from '../controllers/auth.controller.js';
import ValidatorMiddleware from '../middlewares/validators.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { validationSchemas } from '../validation/index.js';

router.post('/auth/login', ValidatorMiddleware.validateBody(validationSchemas.loginForm), AuthController.userLogin);

router.post(
    '/auth/register',
    ValidatorMiddleware.validateBody(validationSchemas.registerForm),
    AuthController.userRegister,
);

router.post('/auth/verify-token', AuthMiddleware.tokenChecker, (req, res) => {
    res.status(200).json({ message: 'Token is valid' });
});

export default router;
