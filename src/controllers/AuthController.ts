import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Controller responsável pelos endpoints de autenticação:
 * cadastro (RF05) e login (RF07).
 */
export class AuthController {
  private readonly authService = new AuthService();

  register = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.authService.register(req.body);
    res.status(201).json({ status: 'success', data: user });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);
    res.status(200).json({ status: 'success', data: result });
  });
}

export const authController = new AuthController();
