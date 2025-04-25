const mongoose = require('mongoose')

const vendaSchema = new mongoose.Schema({
    produtos: [{
        produto:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Produto',
            required: true
        },
        quantidade: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    data: {
        type: Date, //manualmente?:
        default: Date.now
    }
})

module.exports = mongoose.model('Venda', vendaSchema)