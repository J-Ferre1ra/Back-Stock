const PDFDocument = require("pdfkit");
const Transacao = require("../models/transacao");

const gerarRelatorioTransacoes = async (req, res) => {
  try {
    const { periodo, inicio, fim } = req.query;
    let filtroData = {};

    if (periodo) {
      const agora = new Date();
      let dataInicio = null;

      if (periodo === "7dias") {
        dataInicio = new Date();
        dataInicio.setDate(agora.getDate() - 7);
      } else if (periodo === "30dias") {
        dataInicio = new Date();
        dataInicio.setDate(agora.getDate() - 30);
      } else if (periodo === "mes") {
        dataInicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
      } else if (periodo === "ano") {
        dataInicio = new Date(agora.getFullYear(), 0, 1);
      }

      if (dataInicio) {
        filtroData.data = { $gte: dataInicio };
      }
    } else if (inicio && fim) {
      filtroData.data = {
        $gte: new Date(inicio),
        $lte: new Date(fim),
      };
    }

    const transacoes = await Transacao.find(filtroData)
      .populate("produto", "nome")
      .sort({ data: 1 });

    let totalEntrada = 0;
    let totalSaida = 0;
    let totalVenda = 0;
    let totalDespesa = 0;

    transacoes.forEach((t) => {
      const v = Number(t.valor || 0);

      if (t.tipo === "entrada") totalEntrada += v;
      else if (t.tipo === "saída") totalSaida += v;
      else if (t.tipo === "venda") totalVenda += v;
      else if (t.tipo === "despesa") totalDespesa += v;
    });

    const saldoFinal = totalEntrada + totalVenda - (totalSaida + totalDespesa);

    const doc = new PDFDocument({ autoFirstPage: true, margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=relatorio_transacoes.pdf"
    );

    doc.pipe(res);

    doc.fontSize(18).text("Relatório de Transações", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(
      `Data de geração: ${new Date().toLocaleDateString("pt-BR")}`,
      { align: "center" }
    );
    doc.moveDown();

    if (periodo) {
      let desc = "";
      if (periodo === "7dias") desc = "Últimos 7 dias";
      else if (periodo === "30dias") desc = "Últimos 30 dias";
      else if (periodo === "mes") desc = "Mês atual";
      else if (periodo === "ano") desc = "Ano atual";

      doc.text(`Período: ${desc}`, { align: "center" });
      doc.moveDown();
    } else if (inicio && fim) {
      doc.text(
        `Período: ${new Date(inicio).toLocaleDateString(
          "pt-BR"
        )} até ${new Date(fim).toLocaleDateString("pt-BR")}`,
        { align: "center" }
      );
      doc.moveDown();
    }

    const moeda = (v) => `R$ ${Number(v).toFixed(2).replace(".", ",")}`;

    doc.fontSize(14).text("Resumo Financeiro", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Total Entradas: ${moeda(totalEntrada)}`);
    doc.text(`Total Saídas: ${moeda(totalSaida)}`);
    doc.text(`Total Vendas: ${moeda(totalVenda)}`);
    doc.text(`Total Despesas: ${moeda(totalDespesa)}`);
    doc.text("----------------------------------------");
    doc.text(`Saldo Final: ${moeda(saldoFinal)}`);
    doc.moveDown();

    doc.fontSize(14).text("Transações", { underline: true });
    doc.moveDown(0.8);

    transacoes.forEach((t) => {
      const data = t.data
        ? new Date(t.data).toLocaleString("pt-BR")
        : "-";

      doc.fontSize(12).text(`Data: ${data}`);
      doc.text(`Tipo: ${t.tipo}`);
      doc.text(`Produto: ${t.produto?.nome || "-"}`);
      doc.text(`Quantidade: ${t.quantidade || 0}`);
      doc.text(`Valor: ${moeda(t.valor)}`);
      if (t.observacao) doc.text(`Observação: ${t.observacao}`);
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao gerar relatório de transações" });
  }
};

module.exports = { gerarRelatorioTransacoes };
