const Venda = require('../models/venda')
const Produto = require('../models/produto')

const criarVenda = async (req, res) => {
  try {
    const { produtos } = req.body

    let total = 0
    const detalhesProdutos = []
    const produtosAtualizados = []

    for (let item of produtos) {
      const produto = await Produto.findOne({ nome: item.nomeProduto })

      if (!produto || produto.quantidade < item.quantidade) {
        for (let p of produtosAtualizados) {
          const original = await Produto.findById(p._id)
          original.quantidade += p.quantidadeAlterada
          await original.save()
        }

        return res.status(400).json({
          erro: `Produto "${item.nomeProduto}" não encontrado ou estoque insuficiente`
        })
      }

      const subtotal = item.valor * item.quantidade
      total += subtotal

      detalhesProdutos.push({
        nomeProduto: item.nomeProduto,
        quantidade: item.quantidade,
        valor: item.valor,
        subtotal
      })

      produto.quantidade -= item.quantidade;
      await produto.save()

      produtosAtualizados.push({
        _id: produto._id,
        quantidadeAlterada: item.quantidade
      })
    }

    const novaVenda = new Venda({
      produtos: detalhesProdutos,
      total
    })

    await novaVenda.save()

    res.status(201).json(novaVenda)
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: 'Erro ao criar venda' })
  }
};

const listarVendas = async (req, res) => {
  try {
    const vendas = await Venda.find()
    res.json(vendas)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar as vendas' })
  }
}

module.exports = { criarVenda, listarVendas }
