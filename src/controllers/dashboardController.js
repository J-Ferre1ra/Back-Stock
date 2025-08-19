const produto = require("../models/produto");
const venda = require('../models/venda');
const transacao = require('../models/transacao');
const despesa = require('../models/despesa');

const getDashboard = async (req, res) => {
  try {
    const totalProdutos = await produto.countDocuments();

    const totalVendas = await venda.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const totalVendasValor = totalVendas.length > 0 ? totalVendas[0].total : 0;

    const totalDespesas = await despesa.aggregate([
      { $group: { _id: null, total: { $sum: "$valor" } } }
    ]);
    const totalDespesasValor = totalDespesas.length > 0 ? totalDespesas[0].total : 0;

    const lucroLiquido = totalVendasValor - totalDespesasValor;

    const entradas = await transacao.aggregate([
      { $match: { tipo: 'entrada' } },
      { $group: { _id: null, total: { $sum: "$valor" } } }
    ]);
    const saidas = await transacao.aggregate([
      { $match: { tipo: { $in: ['saída', 'venda'] } } },
      { $group: { _id: null, total: { $sum: "$valor" } } }
    ]);
    const totalEntradas = entradas.length > 0 ? entradas[0].total : 0;
    const totalSaidas = saidas.length > 0 ? saidas[0].total : 0;
    const saldoAtual = (totalEntradas + totalVendasValor) - totalSaidas;;

    const transacoesRecentes = await transacao.find().sort({ data: -1 }).limit(5);

    const itensComEstoqueBaixo = await produto.find({ quantidade: { $lt: 10 } });

    res.json({
      totalProdutos,
      totalVendas: totalVendasValor,
      totalDespesas: totalDespesasValor,
      lucroLiquido,
      saldoAtual,
      transacoesRecentes,
      itensComEstoqueBaixo
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao carregar dados do dashboard!' });
  }
};

module.exports = { getDashboard };
