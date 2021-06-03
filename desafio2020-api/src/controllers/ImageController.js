const Trash = require('../models/Trash')
const responseCodes = require('../utils/responseCodes')
const log = require('log4js').getLogger('app')

module.exports = {
  async uploadImage (req, res) {
    try {
      const { trashId } = req.body
      const { location: url = '' } = req.file
      const trash = await Trash.findById(trashId)

      trash.image = url

      await trash.save()

      return res.status(200).json({ status: 'success' })
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on uploadImage')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  }
}
