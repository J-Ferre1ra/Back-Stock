const express = require('express')
const router = express.Router()
const clienteController = require('../controllers/clienteController')
const autenticarToken = require('../middleware/auth')

router.post('/clientes', autenticarToken, clienteController.criarCliente)

router.get('/clientes', autenticarToken, clienteController.listarClientes)

router.get('/cliente/buscar', autenticarToken, clienteController.buscarCliente)

router.put('/clientes/:id', autenticarToken, clienteController.editarCliente)

router.delete('/clientes/:id', autenticarToken, clienteController.excluirCliente)

module.exports = router