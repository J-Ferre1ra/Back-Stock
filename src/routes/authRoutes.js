const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/authController')
const autenticarToken = require('../middleware/auth')

router.post('/login', AuthController.login)

router.post('/cadastroComKey', AuthController.criarUsuarioComChave)

router.get('/verificar-token', autenticarToken, AuthController.verificarToken)

router.post('/logout', AuthController.logout)

module.exports = router
