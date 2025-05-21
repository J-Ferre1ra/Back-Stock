const mongoose = require('mongoose')

const despesaSchema =  new mongoose.Schema({
    descricao:{
        type: String,
        required: true,
        trim: true
    },
    valor:{
        type: Number,
        required: true,
        min: [1, 'O valor da despesa dever ser positivo!']
    },
    data:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Despesa', despesaSchema)