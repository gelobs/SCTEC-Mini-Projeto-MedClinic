import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRole } from '../entities/User';

export interface TokenPayload {
  sub: string;
  role: UserRole;
}

const JWT_SECRET: string = process.env.JWT_SECRET || 'change-me-in-env-file';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

/** Gera um token JWT contendo, no mínimo, o id e o perfil do usuário (RF07). */
export function generateToken(payload: TokenPayload): string {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign(payload, JWT_SECRET, options);
}

/** Valida e decodifica um token JWT. Lança erro se inválido/expirado (RF08). */
export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
