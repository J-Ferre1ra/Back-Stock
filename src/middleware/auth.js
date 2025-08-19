const jwt = require('jsonwebtoken')

const autenticarToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  let token = authHeader && authHeader.split(' ')[1]

  const parseCookies = (cookieHeader) => {
    const list = {}
    if (!cookieHeader) return list
    cookieHeader.split(';').forEach(cookie => {
      let [name, ...rest] = cookie.split('=')
      name = name && name.trim()
      if (!name) return
      const value = rest.join('=').trim()
      if (!value) return
      list[name] = decodeURIComponent(value)
    })
    return list
  }

  if (!token) {
    const cookies = parseCookies(req.headers && req.headers.cookie)
    token = cookies.token
  }

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ erro: 'Token inválido' })

    req.usuario = usuario
    next()
  })
}

module.exports = autenticarToken