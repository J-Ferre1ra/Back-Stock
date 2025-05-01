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
        min: [1, 'A quantidade deve ser maior que 0']
    },
    preco: {
        type: Number,
        required: [true, 'O preço é obrigatório.'],
        min: [0.01, 'O preço deve ser maior que 0']
    }
})

module.exports = mongoose.model('Produto', produtoSchema)