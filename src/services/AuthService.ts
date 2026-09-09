import { UserRepository } from '../respositories/UserRepository';
import { RegisterDTO } from '../dtos/auth.dto';
import { toUserResponseDTO, UserResponseDTO } from '../dtos/user.dto';
import { hashPassword } from '../utils/hash';
import { AppError } from '../utils/AppError';
import { UserRole } from '../entities/User';

/**
 * Regras de negócio de autenticação: cadastro de usuários (RF05).
 */
export class AuthService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async register(data: RegisterDTO): Promise<UserResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('E-mail já cadastrado', 409);
    }

    const passwordHash = await hashPassword(data.password);

    // Por segurança, o cadastro público nunca cria administradores;
    // o perfil de Administrador é provisionado via seed (ver README).
    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: passwordHash,
      role: UserRole.ATTENDANT,
    });

    return toUserResponseDTO(user);
  }
}
