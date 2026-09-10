import { Router } from 'express';
import { userController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// GET /users/me - RF10 (protegido por authMiddleware)
router.get('/me', authMiddleware, userController.me);

export default router;
