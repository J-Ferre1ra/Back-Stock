const express = require('express')
const router = express.Router()
const produtoController = require('../controllers/produtoController')
const autenticarToken = require('../middleware/auth')
const upload = require('../config/multer')

router.post('/produtos', autenticarToken, upload.single('imagem') , produtoController.criarProduto)

router.get('/produtos', autenticarToken, produtoController.listarProdutos)

router.put('/produtos/:id', autenticarToken, produtoController.editarProduto)

router.delete('/produtos/:id', autenticarToken, produtoController.excluirProduto)

module.exports = router