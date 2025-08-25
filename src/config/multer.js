const multer = require('multer')

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Arquivo não permitido!'), false)
  }
  cb(null, true)
}

const upload = multer({ storage, fileFilter })

module.exports = upload
