import { UserRepository } from '../respositories/UserRepository';
import { RegisterDTO, LoginDTO } from '../dtos/auth.dto';
import { toUserResponseDTO, UserResponseDTO } from '../dtos/user.dto';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import { UserRole } from '../entities/User';

export interface LoginResult {
  token: string;
  user: UserResponseDTO;
}

/**
 * Regras de negócio de autenticação: cadastro e login (RF05/RF06/RF07).
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

  async login(data: LoginDTO): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const passwordMatches = await comparePassword(data.password, user.password);
    if (!passwordMatches) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const token = generateToken({ sub: user.id, role: user.role });

    return { token, user: toUserResponseDTO(user) };
  }
}
