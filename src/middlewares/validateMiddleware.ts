import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Middleware genérico de validação de payload usando um schema Zod.
 * Em caso de dados inválidos, lança ZodError, tratado pelo middleware
 * central de erros (errorMiddleware) e traduzido em HTTP 400.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.body = schema.parse(req.body);
    next();
  };
}
