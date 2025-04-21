const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    senhaHash:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['admin'],
        default: 'admin'
    },
    criadoEm: {
        type: Date,
        default: Date.now
    },
    ultimoAcesso: {
        type: Date
    }
})

module.exports = mongoose.model('User', userSchema)