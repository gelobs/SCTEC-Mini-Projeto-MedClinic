import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Envolve controllers assíncronos para que qualquer erro (rejeição de
 * Promise) seja automaticamente encaminhado ao middleware central de
 * tratamento de erros via next(), sem precisar repetir try/catch em cada
 * método (RF12/RF13).
 */
export function asyncHandler(fn: AsyncController): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
