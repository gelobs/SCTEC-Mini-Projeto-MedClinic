/**
 * Erro de aplicação padronizado. Toda regra de negócio que precisa
 * interromper o fluxo com uma resposta HTTP específica lança um AppError,
 * capturado pelo middleware central de tratamento de erros (RF12).
 */
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
