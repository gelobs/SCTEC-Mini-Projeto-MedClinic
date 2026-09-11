import { Response } from 'express';

/**
 * Helper para padronizar respostas de sucesso da API, evitando repetir
 * a mesma estrutura { status: 'success', data } em cada controller
 * (RF15 - Clean Code / DRY).
 */
export function sendSuccess<T>(res: Response, statusCode: number, data: T, message?: string): void {
  res.status(statusCode).json({
    status: 'success',
    ...(message ? { message } : {}),
    ...(data !== undefined ? { data } : {}),
  });
}
