const Produto = require('../models/produto')
const PDFDocument = require('pdfkit')
const fs = require('fs')

const gerarRelatorioEstoqueComImagens = async (req, res) => {
  try {
    const { filtroPeriodo, dataInicio, dataFim } = req.query
    let filtroData = {}

    if (filtroPeriodo === 'mes') {
      const inicioMes = new Date()
      inicioMes.setMonth(inicioMes.getMonth() - 1)
      filtroData = { data: { $gte: inicioMes } }
    }
    else if (filtroPeriodo === 'semana') {
      const inicioSemana = new Date()
      const diaDaSemana = inicioSemana.getDay()
      inicioSemana.setDate(inicioSemana.getDate() - diaDaSemana)
      filtroData = { data: { $gte: inicioSemana } }
    }
    else if (dataInicio && dataFim) {
      filtroData = { data: { $gte: new Date(dataInicio), $lte: new Date(dataFim) } }
    }

    const produtos = await Produto.find(filtroData)

    const doc = new PDFDocument()
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio_estoque_com_imagens.pdf')

    doc.pipe(res)

    doc.fontSize(18).text('Relatório de Estoque com Imagens', { align: 'center' })
    doc.moveDown()

    doc.fontSize(12).text(`Período: ${new Date().toLocaleDateString()}`, { align: 'center' })
    doc.moveDown()

    doc.fontSize(12).text('Produto | Quantidade | Preço | Descrição | Imagem', { underline: true })

    produtos.forEach(produto => {
      doc.text(`${produto.nome} | ${produto.quantidade} | ${produto.preco} | ${produto.descricao}`)

      if (produto.imagemUrl) {
        doc.image(produto.imagemUrl, { width: 50, height: 50, align: 'center' })
      }

      doc.moveDown()
    })

    doc.end()

  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: 'Erro ao gerar relatório de estoque com imagens' })
  }
}

module.exports = { gerarRelatorioEstoqueComImagens }
