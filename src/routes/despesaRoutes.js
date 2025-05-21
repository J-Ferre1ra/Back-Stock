const express = require('express')
const router = express.Router()
const despesaController = require('../controllers/despesaController')
const autenticarToken = require('../middleware/auth')

router.post('/despesas', autenticarToken, despesaController.criarDespesa)

router.get('/despesas', autenticarToken, despesaController.listarDespesas)

module.exports = router