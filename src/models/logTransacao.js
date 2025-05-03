const mongoose= require('mongoose')

const logTransacaoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    acao: {
        type: String,
        required: true
    },
    transacaoId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transacao',
        required: true
    },
    data: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('LogTransacao', logTransacaoSchema)