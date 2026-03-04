const produto = require("../models/produto");
const transacao = require('../models/transacao');

const getDashboard = async (req, res) => {
  try {
    const totalProdutos = await produto.countDocuments();

    const totalVendasAgg = await transacao.aggregate([
      { $match: { tipo: 'venda' } },
      { $group: { _id: null, total: { $sum: "$valor" } } }
    ]);
    const totalVendasValor = totalVendasAgg.length > 0 ? totalVendasAgg[0].total : 0;


    // Compras de estoque (entrada)
const comprasAgg = await transacao.aggregate([
  { $match: { tipo: 'entrada' } },
  { $group: { _id: null, total: { $sum: "$valor" } } }
]);
const totalCompras = comprasAgg.length > 0 ? comprasAgg[0].total : 0;

const perdasAgg = await transacao.aggregate([
  { $match: { tipo: 'saída' } },
  { $group: { _id: null, total: { $sum: "$valor" } } }
]);
const totalPerdas = perdasAgg.length > 0 ? perdasAgg[0].total : 0;

const despesasAgg = await transacao.aggregate([
  { $match: { tipo: 'despesa' } },
  { $group: { _id: null, total: { $sum: "$valor" } } }
]);
const totalDespesasValor = despesasAgg.length > 0 ? despesasAgg[0].total : 0;

const resultadoFinanceiro =
  totalVendasValor - totalCompras - totalPerdas - totalDespesasValor;

    const transacoesRecentes = await transacao
      .find()
      .populate("produto", "nome")
      .sort({ data: -1 })
      .limit(5);


    const itensComEstoqueBaixo = await produto.find({ quantidade: { $lt: 10 } });

    res.json({
      totalProdutos,
      totalVendas: totalVendasValor,
      totalDespesas: totalDespesasValor,
      lucroLiquido: resultadoFinanceiro,
      saldoAtual: resultadoFinanceiro,
      transacoesRecentes,
      itensComEstoqueBaixo
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao carregar dados do dashboard!' });
  }
};

module.exports = { getDashboard };
