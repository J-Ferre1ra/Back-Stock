require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI, {
}).then(()=> console.log('Conectado ao MongoDB Atlas'))
.catch((err) => console.error('Erro ao conectar ao MongoDB', err))

//teste
app.get('/', (req, res) =>{
    res.send('API funcionando!')
})

const userRoutes = require('./routes/userRouter')
app.use('/api', userRoutes)

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

app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({extended: true, limit: '10mb'}))

module.exports = app