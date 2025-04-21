const Log = require('../models/log')

const registerLog = (acaoBase) => {
    return async (req, res, next) =>{
        try{
            if(req.usuario){
                const nome = req.usuario.nome || 'Usuário'
                const acao = `${nome} ${acaoBase}`

                await Log.create({
                    usuario: req.usuario.id,
                    acao
                })
            }
        }catch(err){
            console.error('Erro ao registrar log:', err.message);
        }
        next()
    }
}

module.exports = registerLog