const multer = require('multer')
const multerS3 = require('multer-s3')
const AWS = require('aws-sdk')
const crypto = require('crypto')
const path = require('path')
const log = require('log4js').getLogger('app')

const storageTypes = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', '..', 'images'))
    },
    filename: (req, file, cb) => {
      try {
        const { user } = req.body
        file.location = process.env.IMAGE_PATH + user + '-' + Date.now().toString() + '.' + file.mimetype.split('/')[1]
        cb(null, user + '-' + Date.now().toString() + '.' + file.mimetype.split('/')[1])
      } catch (error) {
        log.error('-------------------------')
        log.error('Error on Multer')
        log.error(req)
        log.error(error)
        log.error(file)
      }
    }
  }),
  s3: multerS3({
    s3: new AWS.S3(),
    bucket: process.env.AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err)
        const filename = `${hash.toString('hex')}-${file.originalname}`
        cb(null, filename)
      })
    }
  })
}
module.exports = {
  dest: path.resolve(__dirname, '..', '..', '..', 'images'),
  storage: storageTypes.storage
}
