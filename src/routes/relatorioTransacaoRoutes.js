const express = require("express");
const router = express.Router();
const autenticarToken = require("../middleware/auth");
const { gerarRelatorioTransacoes } = require("../controllers/relatorioTransacaoController");

router.get(
  "/relatorio/transacoes",
  autenticarToken,
  gerarRelatorioTransacoes
);

module.exports = router;
