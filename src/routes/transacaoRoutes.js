const express = require('express')
const router = express.Router()
const transacaoController = require('../controllers/transacaoController')
const autenticarToken = require('../middleware/auth')

router.post('/transacoes', autenticarToken, transacaoController.criarTransacao)

router.get('/transacoes', autenticarToken, transacaoController.listarTransacoes)

router.get('/logs/transacoes', autenticarToken, transacaoController.listarLogs)

module.exports = router