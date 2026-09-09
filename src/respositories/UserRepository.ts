import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { User } from '../entities/User';

/**
 * Camada de acesso a dados do usuário (Repositories).
 * Único ponto do sistema que conversa diretamente com o TypeORM/PostgreSQL
 * para operações relacionadas à entidade User.
 */
export class UserRepository {
  private readonly repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async create(data: Pick<User, 'name' | 'email' | 'password' | 'role'>): Promise<User> {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }
}
