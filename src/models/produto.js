const mongoose = require('mongoose')

const produtoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome do produto é obrigatório.']
    },
    descricao: {
        type: String,
        required: false
    },
    quantidade: {
        type: Number,
        required: [true, 'A quantidade é obrigatória.'],
        default: 0,
        min: 0
    },
    preco: {
        type: Number,
        default: 0,
        required: false
    }
})

module.exports = mongoose.model('Produto', produtoSchema)