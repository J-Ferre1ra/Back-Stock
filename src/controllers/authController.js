const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const login = async (req, res) => {
  const { email, senha } = req.body

  try {
    const usuario = await User.findOne({ email })

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' })
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash)
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Senha incorreta' })
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    )

    res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      token
    })
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno no login', detalhe: err.message })
  }
}

const criarUsuarioComChave = async (req, res) => {
  const { nome, email, senha, creatorKey } = req.body

  if (creatorKey !== process.env.CREATOR_KEY) {
    return res.status(403).json({ erro: 'Chave de autorização inválida.' })
  }

  try {
    const usuarioExistente = await User.findOne({ email })
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Email já está em uso.' })
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const novoUsuario = new User({
      nome,
      email,
      senhaHash
    })

    await novoUsuario.save()

    res.status(201).json({ mensagem: 'Usuário criado com sucesso.' })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar usuário.', detalhe: err.message })
  }
}

module.exports = {
  login,
  criarUsuarioComChave
}
