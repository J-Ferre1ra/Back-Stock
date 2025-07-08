const express = require('express')
const router = express.Router()
const { gerarRelatorioVendas } = require('../controllers/relatorioVendasController')

router.get('/relatorio/vendas', gerarRelatorioVendas)

module.exports = router
