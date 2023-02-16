import { router } from "../config/express.js";
import { userLogin, userRegister } from "../api/controllers/auth.js";
import { validateBody } from "../api/middlewares/validators.js";
import { validationSchemas } from "../validation/index.js";

router.post(
    "/auth/login",
    validateBody(validationSchemas.loginForm),
    (req, res, next) => {
        userLogin(req, res, next);
    }
);

router.post(
    "/auth/register",
    validateBody(validationSchemas.registerForm),
    (req, res, next) => {
        userRegister(req, res, next);
    }
);

export default router;
