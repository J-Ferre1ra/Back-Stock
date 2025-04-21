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

module.exports = app