import { UserRepository } from '../respositories/UserRepository';
import { toUserResponseDTO, UserResponseDTO } from '../dtos/user.dto';
import { AppError } from '../utils/AppError';

/**
 * Regras de negócio relacionadas à consulta de dados do próprio usuário
 * autenticado (RF10 - GET /users/me).
 */
export class UserService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async getProfile(userId: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }
    return toUserResponseDTO(user);
  }
}
