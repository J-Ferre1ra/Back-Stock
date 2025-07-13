const LogTransacao = require('../models/logTransacao')

const registrarLogTransacao = async (usuarioId, acao, transacaoId) =>{
    try{
        const log = new LogTransacao({
            usuario: usuarioId,
            acao: acao,
            transacaoId: transacaoId
        })

        await log.save()

    }catch(err) {
        console.error(err)
        throw new Error('Erro ao registrar o log da transação')
    }
}

const listarLogs = async (req, res) =>{
    try{
        const logs = await LogTransacao.find().populate('usuario', 'nome').populate('transacaoId').exec()
        res.json(logs)
    }catch(err) {
        res.status(500).json({erro: 'Erro ao listar logs de transação'})
    }
}

module.exports = {registrarLogTransacao, listarLogs}