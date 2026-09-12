import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';

/**
 * Middleware central de tratamento de erros (RF12).
 * Garante respostas HTTP estruturadas em JSON e evita que falhas de
 * validação, autenticação ou conexão interrompam a execução da API.
 *
 * Precisa ser registrado por último, depois de todas as rotas.
 */
export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      status: 'error',
      message: 'Dados inválidos',
      errors: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  console.error('[unhandled error]', err);

  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  });
}
