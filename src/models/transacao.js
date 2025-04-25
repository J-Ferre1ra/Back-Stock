const mongoose = require('mongoose')

const transacaoSchema = new mongoose.Schema({
    tipo: {
        type: String,
        enum: ['entrada', 'saída'],
        required: true
    },
    produto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produto',
        required: true
    },
    quantidade: {
        type: Number,
        required: true,
        min: [1, 'A quantidade deve ser maior que 0']
    },
    data: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Transacao', transacaoSchema)