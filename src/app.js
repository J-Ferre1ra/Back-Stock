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

module.exports = app