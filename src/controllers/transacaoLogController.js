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

module.exports = {registrarLogTransacao}