import { Request, Response, NextFunction } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';

/**
 * Middleware de autenticação (RF08).
 * Valida o token JWT enviado no header Authorization (Bearer <token>)
 * e anexa o payload decodificado em req.user para uso nas próximas camadas.
 */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token de autenticação não informado', 401);
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new AppError('Formato de token inválido. Utilize: Bearer <token>', 401);
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    // Diferencia token expirado de token inválido para uma mensagem mais clara
    // ao cliente, sem revelar detalhes internos de assinatura/estrutura do JWT.
    if (error instanceof TokenExpiredError) {
      throw new AppError('Token expirado. Faça login novamente.', 401);
    }
    throw new AppError('Token inválido', 401);
  }
}
