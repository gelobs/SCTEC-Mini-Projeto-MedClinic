import { Router } from 'express';
import { authController } from '../controllers/AuthController';
import { validate } from '../middlewares/validateMiddleware';
import { registerSchema, loginSchema } from '../dtos/auth.dto';

const router = Router();

// POST /auth/register - RF05
router.post('/register', validate(registerSchema), authController.register);

// POST /auth/login - RF07
router.post('/login', validate(loginSchema), authController.login);

export default router;
