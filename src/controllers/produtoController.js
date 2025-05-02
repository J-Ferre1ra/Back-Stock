const Produto = require('../models/produto')

const criarProduto = async (req, res) =>{
    try{
        const {nome, quantidade, preco} = req.body

        if (quantidade <= 0 || preco <= 0) {
            return res.status(400).json({erro: 'A quantidade e o preço devem ser maior que 0'})
        }

        const novoProduto = new Produto({nome, quantidade, preco})
        await novoProduto.save()

        res.status(201).json(novoProduto)
    }catch (err) {
        res.status(500).json({erro: 'Erro ao criar o produto'})
    }
}

const listarProdutos = async (req, res) =>{
    try{
        const { ordenarPor, ordem, nome } = req.query

        const sortField = ordenarPor || 'nome'
        const sortOrder = ordem === 'desc' ? -1 : 1

        const filtroNome = nome ? { nome: { $regex: nome, $options: 'i' } } : {}

        const produtos = await Produto.find(filtroNome)
        .sort({ [sortField]: sortOrder })

        res.json(produtos)
    }catch (err){
        res.status(500).json({erro: 'Erro ao listar os produtos'})
    }
}

const editarProduto = async (req, res) =>{
    try{
        const {id} = req.params
        const {nome, quantidade, preco} = req.body
        
        const produto = await Produto.findById(id)
        if (!produto) {
            return res.status(404).json({erro: 'Produto não encontrado'})
        }

        produto.nome = nome || produto.nome
        produto.quantidade = quantidade || produto.quantidade
        produto.preco = preco || produto.preco
        
        await produto.save()

        res.json(produto)
    }catch(err){
        console.error(err)
        res.status(500).json({erro:'Erro ao editar o produto'})
    }
}

const excluirProduto = async (req, res) =>{
    try{
        const {id} = req.params

        const produto = await Produto.findById(id)
        if (!produto) {
            return res.status(404).json({erro:'Produto não encontrado'})
        }

        await Produto.findByIdAndDelete(id)
        res.json({mensagem: 'Produto excluído com sucesso'})
    }catch (err){
        console.error(err)
        res.status(500).json({erro: 'Erro ao excluir o produto'})
    }
}

module.exports = {criarProduto, listarProdutos, editarProduto, excluirProduto}