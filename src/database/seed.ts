import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { UserRepository } from '../respositories/UserRepository';
import { hashPassword } from '../utils/hash';
import { UserRole } from '../entities/User';

dotenv.config();

/**
 * Script de seed: cria o primeiro usuário Administrador do sistema.
 * O endpoint público de cadastro (POST /auth/register) nunca cria
 * administradores, então esta é a forma de provisionar o primeiro acesso
 * administrativo (necessário para demonstrar o RBAC no vídeo de entrega).
 *
 * Execução: npm run seed
 */
async function seedAdmin(): Promise<void> {
  await AppDataSource.initialize();

  const userRepository = new UserRepository();

  const email = process.env.ADMIN_SEED_EMAIL || 'admin@medclinic.com';
  const password = process.env.ADMIN_SEED_PASSWORD || 'Admin@123';

  const existing = await userRepository.findByEmail(email);
  if (existing) {
    console.log(`Usuário administrador "${email}" já existe. Nada a fazer.`);
    await AppDataSource.destroy();
    return;
  }

  const passwordHash = await hashPassword(password);

  await userRepository.create({
    name: 'Administrador MedClinic',
    email,
    password: passwordHash,
    role: UserRole.ADMIN,
  });

  console.log(`Usuário administrador criado com sucesso: ${email} / ${password}`);
  console.log('IMPORTANTE: altere essa senha em um ambiente real.');

  await AppDataSource.destroy();
}

seedAdmin().catch((error) => {
  console.error('Erro ao executar o seed do administrador:', error);
  process.exit(1);
});
