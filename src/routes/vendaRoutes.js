const express = require('express')
const router = express.Router()
const vendaController = require('../controllers/vendaController')
const autenticarToken = require('../middleware/auth')

router.post('/vendas', autenticarToken, vendaController.criarVenda)

router.get('/vendas', autenticarToken, vendaController.listarVendas)

module.exports = router