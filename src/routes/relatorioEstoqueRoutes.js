const express = require('express')
const router = express.Router()
const autenticarToken = require('../middleware/auth');
const { gerarRelatorioEstoqueComImagens } = require('../controllers/relatorioEstoqueController')

router.get('/relatorio/estoque-com-imagens', autenticarToken ,gerarRelatorioEstoqueComImagens)

module.exports = router
