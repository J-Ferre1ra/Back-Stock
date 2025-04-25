const venda = require('../models/venda')
const Produto = require('../models/produto')

const criarVenda = async (req, res) =>{
    try{
        const {produtos, total} = req.body

        for(let item of produtos){
            const produto = await Produto.findById(item.produto)
            if (!produto || produto.quantidade < item.quantidade) {
                return res.status(400).json({erro: 'Produto não encontrado ou estoque insuficiente'})
            }
        }

        const novaVenda = new venda({produtos, total})
        await novaVenda.save()
    
        for(let item of produtos){
            const produto = await Produto.findById(item.produto)
            produto.quantidade -= item.quantidade
            await produto.save()
        }
        res.status(201).json(novaVenda)
    }catch (err){
        res.status(500).json({erro: 'Erro ao criar venda'})
    }
}

const listarVendas = async (req, res) =>{
    try{
        const vendas = await venda.find()
        res.json(vendas)
    }catch(err) {
        res.status(500).json({erro: 'Erro ao listar as vendas'})
    }
}

module.exports = {criarVenda, listarVendas}