const express = require('express')
const router = express.Router()
const { gerarRelatorioEstoqueComImagens } = require('../controllers/relatorioEstoqueController')

router.get('/relatorio/estoque-com-imagens', gerarRelatorioEstoqueComImagens)

module.exports = router
