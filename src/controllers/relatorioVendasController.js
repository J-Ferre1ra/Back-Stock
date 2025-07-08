const Venda = require('../models/venda');
const PDFDocument = require('pdfkit'); // Usando pdfkit para gerar o PDF

// Função para gerar o relatório de vendas
const gerarRelatorioVendas = async (req, res) => {
  try {
    const { filtroPeriodo, dataInicio, dataFim } = req.query;
    let filtroData = {};

    // Filtro para o período de um mês
    if (filtroPeriodo === 'mes') {
      const inicioMes = new Date();
      inicioMes.setMonth(inicioMes.getMonth() - 1);  // Últimos 30 dias
      filtroData = { data: { $gte: inicioMes } };
    }
    // Filtro para o período da última semana
    else if (filtroPeriodo === 'semana') {
      const inicioSemana = new Date();
      const diaDaSemana = inicioSemana.getDay();
      inicioSemana.setDate(inicioSemana.getDate() - diaDaSemana); // Últimos 7 dias
      filtroData = { data: { $gte: inicioSemana } };
    }
    // Filtro para um intervalo personalizado
    else if (dataInicio && dataFim) {
      filtroData = { data: { $gte: new Date(dataInicio), $lte: new Date(dataFim) } };
    }

    // Obtendo vendas no período e populando os produtos
    const vendas = await Venda.find(filtroData)
      .populate('produtos.produto');  // Populando a referência do produto dentro do array

    // Gerar PDF com as vendas no período
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio_vendas.pdf');

    doc.pipe(res);

    // Adicionar título
    doc.fontSize(18).text('Relatório de Vendas', { align: 'center' });
    doc.moveDown();

    // Adicionar a data do relatório
    doc.fontSize(12).text(`Período: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown();

    // Tabela de vendas
    doc.fontSize(12).text('Produto | Quantidade | Total', { underline: true });

    // Acessando os dados de cada venda
    vendas.forEach(venda => {
      venda.produtos.forEach(item => {
        if (item.produto) {
          // Verificando se o produto existe antes de acessar 'nome'
          doc.text(`${item.produto.nome} | ${item.quantidade} | ${venda.total}`);
        } else {
          doc.text(`Produto não encontrado | ${item.quantidade} | ${venda.total}`);
        }
      });
    });

    doc.end();  // Finaliza o PDF e envia a resposta

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao gerar relatório de vendas' });
  }
};

module.exports = { gerarRelatorioVendas };
