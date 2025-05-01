const express = require('express')
const router = express.Router()
const produtoController = require('../controllers/produtoController')
const autenticarToken = require('../middleware/auth')

router.post('/produtos', autenticarToken, produtoController.criarProduto)

router.get('/produtos', autenticarToken, produtoController.listarProdutos)

router.put('/produtos/:id', autenticarToken, produtoController.editarProduto)

router.delete('/produtos/:id', autenticarToken, produtoController.excluirProduto)

module.exports = router