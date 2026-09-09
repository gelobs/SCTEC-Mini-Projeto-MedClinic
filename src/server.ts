import 'reflect-metadata';
import express, { Application } from 'express';
import * as dotenv from 'dotenv';
import { AppDataSource } from './database/data-source';
import routes from './routes';

dotenv.config();

const app: Application = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'MedClinic API - Etapa 1: Autenticação e Autorização',
  });
});

app.use(routes);

AppDataSource.initialize()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  });

export default app;
