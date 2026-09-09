import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * Perfis de acesso suportados pelo sistema (RF09 - RBAC).
 * Administrador: acesso completo às funcionalidades da API.
 * Atendente: acesso operacional, com permissões restritas.
 */
export enum UserRole {
  ADMIN = 'admin',
  ATTENDANT = 'attendant',
}

/**
 * Entidade de usuário do sistema (RF03).
 * Representa a tabela "users" no PostgreSQL.
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string;

  /** Senha armazenada exclusivamente como hash (RF06). Nunca em texto puro. */
  @Column({ type: 'varchar', name: 'password_hash' })
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ATTENDANT,
  })
  role!: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
