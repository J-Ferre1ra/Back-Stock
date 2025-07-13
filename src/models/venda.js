const mongoose = require('mongoose');

const vendaSchema = new mongoose.Schema({
  produtos: [{
  nomeProduto: {
    type: String,
    required: true
  },
  quantidade: {
    type: Number,
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  }
  }],
  total: {
    type: Number,
    required: true
  },
  data: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Venda', vendaSchema);

