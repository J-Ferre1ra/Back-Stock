const Produto = require('../models/produto')
const Log = require('../models/log')
const cloudinary = require('../config/cloudinary')

const criarProduto = async (req, res) => {
  try {
    const { nome, quantidade, preco, descricao } = req.body

    if (!nome || !quantidade || !preco) {
      return res.status(400).json({ erro: 'Campos obrigatórios não fornecidos' })
    }

    if (quantidade <= 0 || preco <= 0) {
      return res.status(400).json({ erro: 'A quantidade e o preço devem ser maiores que 0' })
    }

    let imageUrl = ''
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'produtos' },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )
        stream.end(req.file.buffer)
      })

      imageUrl = result.secure_url
    }

    const novoProduto = new Produto({
      nome,
      quantidade,
      preco,
      imagem: imageUrl
    })

    await novoProduto.save()

    const log = new Log({
      usuario: req.usuario.id,
      acao: `Criou o produto: ${novoProduto.nome}`
    })
    await log.save()

    res.status(201).json({
      mensagem: 'Produto criado com sucesso',
      produto: novoProduto
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: 'Erro ao criar o produto', detalhe: err.message })
  }
}

const listarProdutos = async (req, res) => {
    try {
        const { ordenarPor, ordem, nome } = req.query

        const sortField = ordenarPor || 'nome'
        const sortOrder = ordem === 'desc' ? -1 : 1

        const filtroNome = nome ? { nome: { $regex: nome, $options: 'i' } } : {}

        const produtos = await Produto.find(filtroNome).sort({ [sortField]: sortOrder }) 

        res.json(produtos)
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao listar os produtos', detalhe: err.message })
    }
}

const editarProduto = async (req, res) =>{
    try{
        const {id} = req.params
        const {nome, quantidade, preco, descricao} = req.body
        
        const produto = await Produto.findById(id)
        if (!produto) {
            return res.status(404).json({erro: 'Produto não encontrado'})
        }

        produto.nome = nome || produto.nome
        produto.quantidade = quantidade || produto.quantidade
        produto.preco = preco || produto.preco
        produto.descricao = descricao || produto.descricao

        
        await produto.save()

        const log = new Log({
            usuario: req.usuario.id,
            acao: `Editou o produto: ${produto.nome}`
        })
        await log.save()

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

        const log = new Log({
            usuario: req.usuario.id,
            acao: `Excluiu o produto: ${produto.nome}`
        })
        await log.save()

        res.json({mensagem: 'Produto excluído com sucesso'})
    }catch (err){
        console.error(err)
        res.status(500).json({erro: 'Erro ao excluir o produto'})
    }
}

module.exports = {criarProduto, listarProdutos, editarProduto, excluirProduto}