const express = require('express');
const router = express.Router();
const transacaoLogController = require('../controllers/transacaoLogController');
const autenticarToken = require('../middleware/auth')

router.get('/atividades', autenticarToken, transacaoLogController.listarLogs);

module.exports = router;
