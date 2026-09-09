import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Controller responsável pelos endpoints de autenticação.
 */
export class AuthController {
  private readonly authService = new AuthService();

  register = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.authService.register(req.body);
    res.status(201).json({ status: 'success', data: user });
  });
}

export const authController = new AuthController();
