import express from 'express';
const router = express.Router({ mergeParams: true });
import authController from '../controllers/auth.controller.js';
import validatorMiddleware from '../middlewares/validators.middleware.js';
import { validationSchemas } from '../validation/index.js';

router.post('/auth/login', validatorMiddleware.validateBody(validationSchemas.loginForm), authController.userLogin);

router.post(
    '/auth/register',
    validatorMiddleware.validateBody(validationSchemas.registerForm),
    authController.userRegister,
);

export default router;
