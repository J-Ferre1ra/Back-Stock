const Produto = require('../models/produto');
const PDFDocument = require('pdfkit');
const axios = require('axios');

const gerarRelatorioEstoqueComImagens = async (req, res) => {
  try {
    const { filtroPeriodo, dataInicio, dataFim } = req.query;
    let filtroData = {};

    if (filtroPeriodo === 'mes') {
      const inicioMes = new Date();
      inicioMes.setMonth(inicioMes.getMonth() - 1);
      filtroData = { data: { $gte: inicioMes } };
    } else if (filtroPeriodo === 'semana') {
      const inicioSemana = new Date();
      const diaDaSemana = inicioSemana.getDay();
      inicioSemana.setDate(inicioSemana.getDate() - diaDaSemana);
      filtroData = { data: { $gte: inicioSemana } };
    } else if (dataInicio && dataFim) {
      filtroData = {
        data: { $gte: new Date(dataInicio), $lte: new Date(dataFim) }
      };
    }

    const produtos = await Produto.find(filtroData);

    const doc = new PDFDocument({ autoFirstPage: true });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=relatorio_estoque_com_imagens.pdf'
    );
    doc.pipe(res);

    // TÍTULO
    doc.fontSize(18).text('Relatório de Estoque com Imagens', { align: 'center' });
    doc.moveDown();
    doc
      .fontSize(12)
      .text(`Data de geração: ${new Date().toLocaleDateString()}`, {
        align: 'center'
      });
    doc.moveDown();

    // PRODUTOS
    for (const produto of produtos) {
      doc.fontSize(12).text(`Nome: ${produto.nome}`);
      doc.text(`Quantidade: ${produto.quantidade}`);
      doc.text(`Preço: R$ ${produto.preco.toFixed(2)}`);

      if (produto.descricao) {
        doc.text(`Descrição: ${produto.descricao}`);
      }

      doc.moveDown(0.5);

      // MOSTRAR TODAS AS IMAGENS DO PRODUTO
      if (produto.imagens && produto.imagens.length > 0) {
        for (const imagemUrl of produto.imagens) {
          try {
            const response = await axios.get(imagemUrl, {
              responseType: 'arraybuffer'
            });

            const buffer = Buffer.from(response.data, 'binary');

            doc.image(buffer, {
              fit: [140, 140],
              align: 'left'
            });

            doc.moveDown(0.5);
          } catch (imgErr) {
            doc.text('[Erro ao carregar imagem]');
          }
        }
      }

      doc.moveDown();
      doc.moveDown();
    }

    doc.end();
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ erro: 'Erro ao gerar relatório de estoque com imagens' });
  }
};

module.exports = { gerarRelatorioEstoqueComImagens };
