import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/httpResponse';

/**
 * Controller responsável pelos endpoints de autenticação:
 * cadastro (RF05) e login (RF07).
 */
export class AuthController {
  private readonly authService = new AuthService();

  register = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.authService.register(req.body);
    sendSuccess(res, 201, user);
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);
    sendSuccess(res, 200, result);
  });
}

export const authController = new AuthController();
