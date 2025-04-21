const bcrypt = require('bcryptjs')
const User = require('../models/user')

const criarUser = async (req, res) =>{
    try{
        const { nome, email, senha, role } = req.body
        
        const userExistente = await User.findOne({email})
        if (userExistente) {
            return res.status(400).json({erro: 'Email já cadastrado'})
        }

        const senhaHash = await bcrypt.hash(senha,10)

        const newUser = await User.create({
            nome,
            email,
            senhaHash,
            role: role || 'admin'
        })

        res.status(201).json({
            mensagem: 'Usuário criado com sucesso',
            usuário: {
                id: newUser._id,
                nome: newUser.nome,
                email: newUser.email,
                role: newUser.role
            }
        })
    }catch(err) {
        res.status(500).json({erro: 'Erro ao criar usuário', detalhe: err.message})
    }
}
module.exports = {
    criarUser
}