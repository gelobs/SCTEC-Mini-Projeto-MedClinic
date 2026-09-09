import { z } from 'zod';

/**
 * DTO de entrada para o cadastro de usuários (RF05).
 * Valida preenchimento obrigatório e formato do e-mail.
 */
export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().trim().email('Formato de e-mail inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
