import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Configuração central de conexão com o PostgreSQL via TypeORM (RF02).
 * As credenciais são lidas exclusivamente do arquivo .env, nunca hard-coded.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'medclinic',
  synchronize: false, // a estrutura do banco é criada via migrations, nunca em produção com synchronize
  logging: process.env.NODE_ENV === 'development',
  // Glob pattern: qualquer entidade adicionada em src/entities é registrada
  // automaticamente, sem necessidade de tocar neste arquivo (facilita a
  // adição futura dos módulos de domínio da clínica).
  entities: [__dirname + '/../entities/*.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  subscribers: [],
});
