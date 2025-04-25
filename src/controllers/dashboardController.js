const produto = require("../models/produto")
const venda = require('../models/venda')
const transacao = require('../models/transacao')

const getDashboard = async (req, res) =>{
    try{
        const totalProdutos = await produto.countDocuments()

        const ultimaVenda = await venda.findOne().sort({data: -1})

        const transacoesRecentes = await transacao.find().sort({data: -1}).limit(5)

        const itensComEstoqueBaixo = await produto.find({quantidade: {$lt: 10}})

        res.json({
            totalProdutos,
            ultimaVenda,
            transacoesRecentes,
            itensComEstoqueBaixo
        })
    }catch(err){
        res.status(500).json({erro: 'Erro ao carregar dados do dashboard!'})
    }
}

module.exports = {getDashboard}