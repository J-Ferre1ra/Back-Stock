const mongoose = require("mongoose")
const clienteSchema = new mongoose.Schema({
    nome:{
        type: String, 
        required: true
    },
    cpf: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{11}$/
    },
    telefone: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Cliente', clienteSchema)