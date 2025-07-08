const Venda = require('../models/venda');
const PDFDocument = require('pdfkit')

const gerarRelatorioVendas = async (req, res) => {
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

    const vendas = await Venda.find(filtroData)
      .populate('produtos.produto')

    const doc = new PDFDocument()
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio_vendas.pdf')

    doc.pipe(res)

    doc.fontSize(18).text('Relatório de Vendas', { align: 'center' })
    doc.moveDown()

    doc.fontSize(12).text(`Período: ${new Date().toLocaleDateString()}`, { align: 'center' })
    doc.moveDown()

    doc.fontSize(12).text('Produto | Quantidade | Total', { underline: true })

    vendas.forEach(venda => {
      venda.produtos.forEach(item => {
        if (item.produto) {
          doc.text(`${item.produto.nome} | ${item.quantidade} | ${venda.total}`)
        } else {
          doc.text(`Produto não encontrado | ${item.quantidade} | ${venda.total}`)
        }
      });
    });

    doc.end()

  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: 'Erro ao gerar relatório de vendas' })
  }
}

module.exports = { gerarRelatorioVendas }
