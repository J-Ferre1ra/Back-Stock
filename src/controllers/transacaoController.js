const transacao = require('../models/transacao');
const Produto = require('../models/produto');
const LogTransacao = require("../models/logTransacao");

const criarTransacao = async (req, res) => {
  try {
    let { tipo, produto, quantidade, valor, observacao } = req.body;

    // 🔹 Tipos permitidos
    const tiposPermitidos = ['entrada', 'saída', 'venda', 'despesa'];

    if (!tiposPermitidos.includes(tipo)) {
      return res.status(400).json({
        erro: 'Tipo inválido. Tipos válidos: entrada, saída, venda, despesa.'
      });
    }

    let produtoExistente = null;

    // 🔹 Produto obrigatório para entrada, saída e venda
    if (['entrada', 'saída', 'venda'].includes(tipo)) {
      produtoExistente = await Produto.findOne({ nome: produto });

      if (!produtoExistente) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }

      // Validação de quantidade
      if (!Number.isInteger(quantidade) || quantidade <= 0) {
        return res.status(400).json({
          erro: 'Quantidade deve ser um número inteiro positivo.'
        });
      }

      // Verificar estoque para saída e venda
      if ((tipo === 'saída' || tipo === 'venda') &&
          produtoExistente.quantidade < quantidade) {
        return res.status(400).json({
          erro: 'Estoque insuficiente'
        });
      }

    } else if (tipo === 'despesa') {
      // 🔹 Despesa não tem produto nem quantidade
      produtoExistente = null;
      quantidade = 0;
    }

    // 🔹 Valor é obrigatório em todos os tipos
    if (!valor || Number(valor) <= 0) {
      return res.status(400).json({
        erro: 'O valor deve ser maior que zero.'
      });
    }

    // 🔹 Cálculo do valor
    let valorTotal = 0;

    if (tipo === 'despesa') {
      valorTotal = Number(valor);
    } else {
      const valorUnitario = Number(valor) || produtoExistente.preco;
      valorTotal = valorUnitario * quantidade;
    }

    // 🔹 Criar a transação
    const novaTransacao = new transacao({
      tipo,
      produto: produtoExistente ? produtoExistente._id : null,
      quantidade,
      valor: valorTotal,
      observacao
    });

    await novaTransacao.save();

    // 🔹 Atualizar estoque quando necessário
    if (produtoExistente) {
      if (tipo === 'saída' || tipo === 'venda') {
        produtoExistente.quantidade -= quantidade;
      } else if (tipo === 'entrada') {
        produtoExistente.quantidade += quantidade;
      }

      await produtoExistente.save();
    }

    // 🔹 Registrar log
    const logDescricao = (() => {
      if (tipo === 'despesa') {
        return `${req.usuario.nome} registrou uma despesa no valor de R$${valorTotal}`;
      }
      return `${req.usuario.nome} registrou uma transação do tipo ${tipo} de ${quantidade} unidades do produto ${produtoExistente.nome} por R$${valorTotal}`;
    })();

    const log = new LogTransacao({
      usuario: req.usuario.id,
      acao: logDescricao,
      transacaoId: novaTransacao._id
    });

    await log.save();

    res.status(201).json(novaTransacao);

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar a transação' });
  }
};

const listarTransacoes = async (req, res) => {
  try {
    const transacoes = await transacao.find()
      .populate('produto', 'nome')
      .sort({ data: -1 })
      .exec();

    res.json(transacoes);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar as transações' });
  }
};

module.exports = { criarTransacao, listarTransacoes };
