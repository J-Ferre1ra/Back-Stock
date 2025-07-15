const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'produtos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4'],
    resource_type: 'auto'
  }
})

const upload = multer({ storage })

module.exports = upload
