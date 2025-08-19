const express = require('express')
const router = express.Router()
const autenticarToken = require('../middleware/auth');
const { gerarRelatorioVendas } = require('../controllers/relatorioVendasController')

router.get('/relatorio/vendas', autenticarToken, gerarRelatorioVendas)

module.exports = router
