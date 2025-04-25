const express = require('express')
const router = express.Router()
const autenticarToken = require('../middleware/auth')
const DashboardController = require('../controllers/dashboardController')

router.get('/dashboard', autenticarToken, DashboardController.getDashboard)

module.exports = router