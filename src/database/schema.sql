-- Script SQL de referência para a Etapa 1 (Autenticação e Autorização) da MedClinic API.
-- A criação oficial do banco é feita pela migration do TypeORM
-- (src/database/migrations/1757600000000-CreateUsersTable.ts, via "npm run migration:run"),
-- mas este script pode ser usado para inspecionar ou recriar a estrutura manualmente.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'attendant' CHECK (role IN ('admin', 'attendant')),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
