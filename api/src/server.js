const express = require('express');
const cors = require('cors');
const consultaRouter = require('./routes/consultasRoute.js');

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));

app.use(consultaRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

const port = 3333;
app.listen(port, () => {
  console.log(`API rodando com sucesso em HTTPS na porta ${port}!`);
});