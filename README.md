# MedClinic API

API para o gerenciamento de uma clínica médica de pequeno porte.

Este repositório contém a **Etapa 1** do projeto: a base de **autenticação e
autorização** do sistema (cadastro de usuários, login com JWT e controle de
acesso por perfil — RBAC). As funcionalidades de domínio da clínica
(especialidades, médicos, pacientes e consultas) serão implementadas em uma
etapa futura, sobre esta mesma base.

## Sumário

- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Arquitetura do projeto](#arquitetura-do-projeto)
- [Requisitos para execução](#requisitos-para-execução)
- [Configuração do ambiente](#configuração-do-ambiente)
- [Instalação e execução](#instalação-e-execução)
- [Usuário administrador (seed)](#usuário-administrador-seed)
- [Perfis de acesso](#perfis-de-acesso)
- [Documentação dos endpoints](#documentação-dos-endpoints)
- [Fluxo de versionamento](#fluxo-de-versionamento)

## Tecnologias utilizadas

- **Node.js** + **TypeScript** (tipagem estática em todas as camadas)
- **Express.js** — framework HTTP
- **TypeORM** — ORM para PostgreSQL (entidades, repositórios, migrations)
- **PostgreSQL** — banco de dados relacional
- **JWT** (`jsonwebtoken`) — autenticação stateless
- **bcryptjs** — hash de senha
- **Zod** — validação de DTOs de entrada
- **dotenv** — variáveis de ambiente

## Arquitetura do projeto

Arquitetura MVC organizada em camadas, seguindo o fluxo:

```
Cliente HTTP → Route → Middleware (Auth/RBAC) → Controller → Service → Repository → PostgreSQL
```

```
src/
├── server.ts               # Ponto de entrada: inicializa Express e a conexão com o banco
├── controllers/            # Recebem a requisição HTTP e retornam a resposta
│   ├── AuthController.ts
│   └── UserController.ts
├── services/                # Regras de negócio (validação, orquestração)
│   ├── AuthService.ts
│   └── UserService.ts
├── respositories/            # Único ponto de acesso ao TypeORM/PostgreSQL
│   └── UserRepository.ts
├── entities/                # Entidades TypeORM
│   └── User.ts
├── dtos/                    # DTOs de entrada (Zod) e saída
│   ├── auth.dto.ts
│   └── user.dto.ts
├── middlewares/
│   ├── authMiddleware.ts     # Valida o JWT (RF08)
│   ├── roleMiddleware.ts      # RBAC (RF09)
│   ├── validateMiddleware.ts  # Validação de payload via Zod
│   └── errorMiddleware.ts     # Tratamento central de erros (RF12)
├── routes/
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   ├── admin.routes.ts
│   └── index.ts
├── database/
│   ├── data-source.ts        # Configuração da conexão (DataSource)
│   ├── migrations/           # Migrations do TypeORM
│   ├── schema.sql            # Script SQL de referência
│   └── seed.ts               # Cria o usuário Administrador inicial
├── utils/
│   ├── hash.ts                # bcrypt
│   ├── jwt.ts                 # geração/validação de token
│   ├── AppError.ts
│   └── asyncHandler.ts
└── types/
    └── express.d.ts          # Extensão do tipo Request (req.user)
```

Os módulos de domínio da clínica (Especialidades, Médicos, Pacientes,
Consultas) **não fazem parte desta etapa**; a estrutura acima já está
preparada para recebê-los sem necessidade de reorganização.

## Requisitos para execução

- Node.js 18 ou superior
- PostgreSQL 13 ou superior
- npm

## Configuração do ambiente

1. Copie o arquivo de exemplo e ajuste os valores conforme seu ambiente:

```bash
cp .env.example .env
```

2. Variáveis disponíveis:

| Variável              | Descrição                                         | Exemplo                  |
|-----------------------|----------------------------------------------------|---------------------------|
| `PORT`                | Porta em que a API vai escutar                     | `3000`                    |
| `DB_HOST`             | Host do PostgreSQL                                  | `localhost`                |
| `DB_PORT`             | Porta do PostgreSQL                                 | `5432`                     |
| `DB_USERNAME`         | Usuário do banco                                    | `postgres`                 |
| `DB_PASSWORD`         | Senha do banco                                      | `postgres`                 |
| `DB_DATABASE`         | Nome do banco de dados                              | `medclinic`                |
| `JWT_SECRET`          | Chave secreta usada para assinar o token JWT         | uma string forte e aleatória |
| `JWT_EXPIRES_IN`      | Tempo de expiração do token                          | `1h`                       |
| `ADMIN_SEED_EMAIL`    | E-mail do administrador criado pelo seed             | `admin@medclinic.com`      |
| `ADMIN_SEED_PASSWORD` | Senha do administrador criado pelo seed              | `Admin@123`                |

## Instalação e execução

```bash
# 1. Instalar dependências
npm install

# 2. Criar o banco de dados (uma vez, no PostgreSQL)
createdb medclinic
# ou, via psql: CREATE DATABASE medclinic;

# 3. Rodar as migrations (cria a tabela "users")
npm run migration:run

# 4. Criar o usuário Administrador inicial
npm run seed

# 5. Subir a API em modo desenvolvimento
npm run dev
```

A API sobe em `http://localhost:3000` (ou na porta definida em `PORT`).

Scripts disponíveis:

| Script                    | Descrição                                                |
|---------------------------|-----------------------------------------------------------|
| `npm run dev`             | Sobe a API em modo desenvolvimento (hot reload)             |
| `npm run build`           | Compila o TypeScript para `dist/`                          |
| `npm start`               | Roda a versão compilada (`dist/server.js`)                  |
| `npm run seed`            | Cria o usuário Administrador inicial                        |
| `npm run migration:run`   | Executa as migrations pendentes                             |
| `npm run migration:revert`| Reverte a última migration                                  |
| `npm run migration:generate -- <nome>` | Gera uma nova migration a partir das entidades |

## Usuário administrador (seed)

O endpoint público `POST /auth/register` **sempre cria usuários com o perfil
"Atendente"** — por segurança, não é possível se auto-promover a
Administrador via cadastro público. Para obter um usuário Administrador
(necessário para demonstrar o RBAC), rode:

```bash
npm run seed
```

Isso cria o usuário definido em `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD`
(padrão: `admin@medclinic.com` / `Admin@123`). Troque essa senha em qualquer
ambiente real.

## Perfis de acesso

| Perfil (`role`) | Descrição                                     |
|------------------|-------------------------------------------------|
| `admin`          | Acesso completo às funcionalidades da API         |
| `attendant`      | Acesso operacional, com permissões restritas       |

## Documentação dos endpoints

Todas as respostas seguem o formato:

```json
{ "status": "success", "data": { /* ... */ } }
```

ou, em caso de erro:

```json
{ "status": "error", "message": "..." }
```

### `POST /auth/register`

Cadastra um novo usuário (sempre com perfil `attendant`).

**Request**
```json
{
  "name": "Joana Silva",
  "email": "joana@medclinic.com",
  "password": "senha123"
}
```

**Response `201`**
```json
{
  "status": "success",
  "data": {
    "id": "ebd27667-e0fd-431c-b032-aebf11763860",
    "name": "Joana Silva",
    "email": "joana@medclinic.com",
    "role": "attendant",
    "createdAt": "2026-09-13T01:57:14.911Z"
  }
}
```

Erros possíveis: `400` (dados inválidos), `409` (e-mail já cadastrado).

### `POST /auth/login`

**Request**
```json
{ "email": "joana@medclinic.com", "password": "senha123" }
```

**Response `200`**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "ebd27667-e0fd-431c-b032-aebf11763860",
      "name": "Joana Silva",
      "email": "joana@medclinic.com",
      "role": "attendant",
      "createdAt": "2026-09-13T01:57:14.911Z"
    }
  }
}
```

Erros possíveis: `401` (credenciais inválidas — mensagem genérica, sem indicar
qual campo está incorreto).

### `GET /users/me` 🔒

Retorna os dados do usuário autenticado. Requer header:
`Authorization: Bearer <token>`

**Response `200`**
```json
{
  "status": "success",
  "data": {
    "id": "ebd27667-e0fd-431c-b032-aebf11763860",
    "name": "Joana Silva",
    "email": "joana@medclinic.com",
    "role": "attendant",
    "createdAt": "2026-09-13T01:57:14.911Z"
  }
}
```

Erros possíveis: `401` (token ausente, inválido ou expirado).

### `GET /admin/ping` 🔒🛡️

Endpoint protegido, acessível **apenas** pelo perfil `admin`. Demonstra o
funcionamento do RBAC.

**Response `200` (usuário admin)**
```json
{
  "status": "success",
  "message": "Acesso concedido: endpoint restrito ao perfil Administrador."
}
```

**Response `403` (usuário attendant)**
```json
{ "status": "error", "message": "Você não tem permissão para acessar este recurso" }
```

### Resumo de status codes usados

| Código | Situação                                                        |
|--------|-------------------------------------------------------------------|
| `200`  | Sucesso                                                             |
| `201`  | Usuário criado com sucesso                                           |
| `400`  | Dados de entrada inválidos                                           |
| `401`  | Não autenticado (sem token / token inválido / expirado / credenciais inválidas) |
| `403`  | Autenticado, porém sem permissão (RBAC)                              |
| `409`  | Conflito (e-mail já cadastrado)                                      |

## Fluxo de versionamento

Este repositório segue um fluxo baseado em GitFlow simplificado:

- `main` — versão estável
- `develop` — integração das funcionalidades
- `feat/setup-projeto`, `feat/auth`, `feat/rbac`, `docs/readme` — branches de
  funcionalidade, integradas em `develop` e, ao final da etapa, em `main`.

O histórico de commits reflete a evolução incremental do projeto (setup →
entidade/migration → repositório → cadastro → criptografia de senha → login/JWT
→ middleware de autenticação → tratamento de erros → RBAC → endpoints de
verificação → refatoração → correção de bug → documentação).
