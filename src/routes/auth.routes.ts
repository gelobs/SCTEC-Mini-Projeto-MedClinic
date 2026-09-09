import { Router } from 'express';
import { authController } from '../controllers/AuthController';
import { validate } from '../middlewares/validateMiddleware';
import { registerSchema } from '../dtos/auth.dto';

const router = Router();

// POST /auth/register - RF05
router.post('/register', validate(registerSchema), authController.register);

export default router;
