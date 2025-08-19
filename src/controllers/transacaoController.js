const transacao = require('../models/transacao')
const Produto = require('../models/produto')
const LogTransacao = require("../models/logTransacao")

const criarTransacao = async (req, res) =>{
    try{
        const { tipo, produto, quantidade, valor, observacao } = req.body

        if(!['entrada', 'saída','venda'].includes(tipo)){
            return res.status(400).json({erro: 'Tipo inválido. Os tipos válidos são "entrada", "saída" ou "venda".'})
        }

        if(quantidade <=0){
            return res.status(400).json({erro: 'Quantidade deve ser maior que zero.'})
        }

        const produtoExistente = await Produto.findOne({ nome: produto })

        if (!produtoExistente) {
            return res.status(404).json({ erro: 'Produto não encontrado' })
        }

        if ((tipo === 'saída' || tipo === 'venda') && produtoExistente.quantidade < quantidade) {
            return res.status(400).json({ erro: 'Estoque insuficiente' })
        }

        const valorFinal = valor || produtoExistente.preco
        const valorTotal = valorFinal * quantidade

        const novaTransacao = new transacao({
            tipo,
            produto: produtoExistente._id, 
            quantidade,
            valor: valorTotal,
            observacao
        })

        await novaTransacao.save()

        if (tipo === 'saída' || tipo === 'venda') {
            produtoExistente.quantidade -= quantidade
        } else if (tipo === 'entrada') {
            produtoExistente.quantidade += quantidade
        }

        await produtoExistente.save()

        const log = new LogTransacao({
            usuario: req.usuario.id,
            acao: `${req.usuario.nome} registrou a ${tipo} de ${quantidade} unidades do produto ${produtoExistente.nome} por R${valorFinal}`,
            transacaoId: novaTransacao._id 
        })

        await log.save()

        res.status(201).json(novaTransacao)
    }catch (err) {
        console.error(err)
        res.status(500).json({ erro: 'Erro ao criar a transação' })
    }
}

const listarTransacoes = async (req, res) =>{
    try {
        const transacoes = await transacao.find()
            .populate('produto', 'nome')
            .exec()

        res.json(transacoes)
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao listar as transações' })
    }
}



module.exports = { criarTransacao, listarTransacoes}
