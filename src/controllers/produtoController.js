const produto = require('../models/produto')

const criarProduto = async (req, res) =>{
    try{
        const {nome, quantidade, preco} = req.body

        if (quantidade <= 0 || preco <= 0) {
            return res.status(400).json({erro: 'A quantidade e o preço devem ser maior que 0'})
        }

        const novoProduto = new produto({nome, quantidade, preco})
        await novoProduto.save()

        res.status(201).json(novoProduto)
    }catch (err) {
        res.status(500).json({erro: 'Erro ao criar o produto'})
    }
}

const listarProdutos = async (req, res) =>{
    try{
        const produtos = await produto.find()
        res.json(produtos)
    }catch (err){
        res.status(500).json({erro: 'Erro ao listar os produtos'})
    }
}

module.exports = {criarProduto, listarProdutos}