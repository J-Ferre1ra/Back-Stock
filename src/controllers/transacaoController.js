const transacao = require('../models/transacao')
const Produto = require('../models/produto')

const criarTransacao = async (req, res) =>{
    try{
        const {tipo, produto, quantidade} = req.body
        const produtoExistente = await Produto.findById(produto)
        if (!produtoExistente) {
            return res.status(400).json({erro: 'Produto não encontrado'})
        }

        if (tipo === 'saída' && produtoExistente.quantidade < quantidade) {
            return res.status(400).json({erro: 'Estoque insuficiente'})
        }

        const novaTransacao = new transacao({tipo, produto, quantidade})
        await novaTransacao.save()

        if (tipo === 'saída') {
            produtoExistentequantiade -= quantidade
        }else{
            produtoExistente.quantidade += quantidade
        }
        await produtoExistente.save()

        res.status(201).json(novaTransacao)
    }catch (err){
        res.status(500).json({erro: 'Erro ao criar a transação'})
    }
}

const listarTransacoes = async (req, res) =>{
    try{
        const transacoes = await transacao.find()
        res.json(transacoes)
    }catch (err){
        res.status(500).json({erro: 'Eroo ao listar as transações'})
    }
}

module.exports = {criarTransacao, listarTransacoes}