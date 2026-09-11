import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

/**
 * Controller com os endpoints de verificação de autenticação/autorização
 * exigidos pelo RF10: GET /users/me e GET /admin/ping.
 */
export class UserController {
  private readonly userService = new UserService();

  me = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Usuário não autenticado', 401);
    }
    const profile = await this.userService.getProfile(req.user.sub);
    res.status(200).json({ status: 'success', data: profile });
  });

  adminPing = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: 'Acesso concedido: endpoint restrito ao perfil Administrador.',
    });
  });
}

export const userController = new UserController();
