const Produto = require('../models/produto')
const PDFDocument = require('pdfkit')

const gerarRelatorioEstoque = async (req, res) => {
  try {
    const { filtroPeriodo, dataInicio, dataFim } = req.query
    let filtroData = {};

    if (filtroPeriodo === 'mes') {
      const inicioMes = new Date()
      inicioMes.setMonth(inicioMes.getMonth() - 1)
      filtroData = { data: { $gte: inicioMes } }
    }
    else if (filtroPeriodo === 'semana') {
      const inicioSemana = new Date()
      const diaDaSemana = inicioSemana.getDay()
      inicioSemana.setDate(inicioSemana.getDate() - diaDaSemana);
      filtroData = { data: { $gte: inicioSemana } }
    }
    else if (dataInicio && dataFim) {
      filtroData = { data: { $gte: new Date(dataInicio), $lte: new Date(dataFim) } }
    }

    const produtosBaixos = await Produto.find({ quantidade: { $lt: 10 }, ...filtroData })

    const doc = new PDFDocument()
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio_estoque.pdf')

    doc.pipe(res)

    doc.fontSize(18).text('Relatório de Estoque - Produtos com Estoque Baixo', { align: 'center' })
    doc.moveDown()

    doc.fontSize(12).text(`Período: ${new Date().toLocaleDateString()}`, { align: 'center' })
    doc.moveDown()

    doc.fontSize(12).text('Produto | Quantidade | Preço', { underline: true })

    produtosBaixos.forEach(produto => {
      doc.text(`${produto.nome} | ${produto.quantidade} | ${produto.preco}`)
    })

    doc.end()

  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: 'Erro ao gerar relatório de estoque' })
  }
}

module.exports = { gerarRelatorioEstoque }