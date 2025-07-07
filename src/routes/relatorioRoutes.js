const express = require('express')
const router = express.Router()
const { gerarRelatorioEstoque } = require('../controllers/relatorioController')

router.get('/relatorio/estoque', gerarRelatorioEstoque)

module.exports = router