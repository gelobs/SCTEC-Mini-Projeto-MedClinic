import express, { Application } from 'express';

const app: Application = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'MedClinic API - Etapa 1: Autenticação e Autorização',
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export default app;
