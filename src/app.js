require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()

const allowedOrigins = [
  "http://localhost:5173",
  "https://estoquemaster.vercel.app"
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, origin)
    }
    return callback(new Error("CORS bloqueado: " + origin))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB', err))

const authRouter = require('./routes/authRoutes')
app.use('/api', authRouter)

const dashboardRoutes = require('./routes/dashboardRoutes')
app.use('/api', dashboardRoutes)

const produtoRoutes = require('./routes/produtoRoutes')
app.use('/api', produtoRoutes)

const vendaRoutes = require('./routes/vendaRoutes')
app.use('/api', vendaRoutes)

const transacaoRoutes = require('./routes/transacaoRoutes')
app.use('/api', transacaoRoutes)

const clienteRoutes = require('./routes/clienteRoutes')
app.use('/api', clienteRoutes)

const despesaRoutes = require('./routes/despesaRoutes')
app.use('/api', despesaRoutes)

const relatorioEstoqueRoutes = require('./routes/relatorioEstoqueRoutes')
app.use('/api', relatorioEstoqueRoutes)

const relatorioVendasRoutes = require('./routes/relatorioVendasRoutes')
app.use('/api', relatorioVendasRoutes)

const relatorioTransacaoRoutes = require('./routes/relatorioTransacaoRoutes')
app.use('/api', relatorioTransacaoRoutes)

const logRoutes = require('./routes/logRoutes')
app.use('/api', logRoutes)

module.exports = app
