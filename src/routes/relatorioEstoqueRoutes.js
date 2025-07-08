const express = require('express')
const router = express.Router()
const { gerarRelatorioEstoque } = require('../controllers/relatorioEstoqueController')

router.get('/relatorio/estoque', gerarRelatorioEstoque)

module.exports = router