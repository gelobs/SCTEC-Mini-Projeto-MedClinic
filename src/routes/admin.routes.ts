import { Router } from 'express';
import { userController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { UserRole } from '../entities/User';

const router = Router();

// GET /admin/ping - RF10 (protegido por authMiddleware + RBAC, apenas Administrador)
router.get('/ping', authMiddleware, roleMiddleware(UserRole.ADMIN), userController.adminPing);

export default router;
