const Code = require('../models/Code')
const responseCodes = require('../utils/responseCodes')
const log = require('log4js').getLogger('app')

module.exports = {
  async checkCode (req, res) {
    try {
      const { code } = req.params

      const codeRegistred = await Code.find({ code })
      if (!codeRegistred.length > 0) return res.status(400).json({ status: 'error', code: responseCodes.CODE_004.CODE, message: responseCodes.CODE_004.MESSAGE })

      return res.status(200).json({ status: 'success' })
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on checkCode')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  },
  async getCodeAndTeam (req, res) {
    try {
      const { code } = req.params

      const codeRegistred = await Code.find({ code }).populate({
        path: 'owner',
        populate: {
          path: 'team'
        }
      })

      if (!codeRegistred.length > 0) return res.status(400).json({ status: 'error', code: responseCodes.CODE_004.CODE, message: responseCodes.CODE_004.MESSAGE })

      return res.status(200).json({ status: 'success', code: code, team: codeRegistred[0].owner.team.name })
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on getCodeAndTeam')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  }
}
