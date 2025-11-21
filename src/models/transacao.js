const mongoose = require('mongoose');

const transacaoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['entrada', 'saída', 'venda', 'despesa'], 
    required: true
  },

  produto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produto',
    default: null 
  },

  quantidade: {
    type: Number,
    default: 0 
  },

  valor: {
    type: Number,
    required: true,
    min: 0
  },

  observacao: {
    type: String,
    default: ''
  },

  data: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transacao', transacaoSchema, 'transacoes');
