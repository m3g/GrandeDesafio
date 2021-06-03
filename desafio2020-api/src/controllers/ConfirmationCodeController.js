const ConfirmationCode = require('../models/ConfirmationCode')
const User = require('../models/User')
const log = require('log4js').getLogger('app')

const moment = require('moment')

const responseCodes = require('../utils/responseCodes')

const { encrypt } = require('../utils/crypto')
const { sendEmailService } = require('../utils/emailService')

module.exports = {
  async sendCode (req, res) {
    try {
      const { email } = req.body

      const userRegistred = await getUserByEmail(email)
      if (userRegistred.length === 0) return res.status(400).json({ status: 'error', code: responseCodes.CODE_011.CODE, message: responseCodes.CODE_011.MESSAGE })
      if (userRegistred[0].loginOption !== 'desafio2020') return res.status(400).json({ status: 'error', code: responseCodes.CODE_015.CODE, message: `${responseCodes.CODE_015.MESSAGE}${titleize(userRegistred[0].loginOption)}.` })

      const { codeAlreadyRequisited, currentCodeData } = await checksIfTheCodeHasAlreadyBeenRequested(email)

      const code = await generateCode()
      const encryptedCode = encrypt(code.toString())

      const timeCodeResend = parseInt(process.env.CODE_TIME_RESEND)
      if (codeAlreadyRequisited) {
        const dateNow = moment(Date.now()).unix()
        let { _id, createdAt: currentCreatedAt } = currentCodeData

        currentCreatedAt = moment(currentCreatedAt).unix()

        if (dateNow - currentCreatedAt > timeCodeResend) {
          await sendEmail(email, code, encryptedCode, _id)
        } else {
          return res.status(400).json({
            status: 'error',
            code: responseCodes.CODE_012.CODE,
            message: `${responseCodes.CODE_012.MESSAGE}${timeCodeResend - (dateNow - currentCreatedAt)} segundos`
          })
        }
      } else {
        await sendEmail(email, code, encryptedCode, false)
      }

      return res.status(200).json({ status: 'success', userId: userRegistred[0]._id })
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on sendCode')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  },
  async getConfirmationCodeByEmail (req, res) {
    try {
      const { email } = req.params
      const codeDataList = await ConfirmationCode.find({ email })
      return res.json({ codeDataList })
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on getConfirmationCodeByEmail')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  },
  async deleteAllCodes (req, res) {
    try {
      const { email } = req.params
      await ConfirmationCode.deleteMany({ email })
      return res.json({ status: 'success' })
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on deleteAllCodes')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  }
}

async function checksIfTheCodeHasAlreadyBeenRequested (email) {
  const confirmationCodeExists = await ConfirmationCode.find({ email })
  const currentConfirmationCode = confirmationCodeExists.filter(email => email.current)
  return { codeAlreadyRequisited: currentConfirmationCode.length > 0, currentCodeData: currentConfirmationCode[0] }
}

async function generateCode () {
  return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
}

async function sendEmail (email, code, encryptedCode, id) {
  id && await ConfirmationCode.updateOne({ _id: id }, { current: false, checked: false })

  await sendEmailService(email, code.toString())

  await ConfirmationCode.create({
    email,
    code: encryptedCode,
    current: true,
    checked: false
  })
}

async function getUserByEmail (email) {
  const user = await User.find({ email })
  return user
}

function titleize (text) {
  var words = text.toLowerCase().split(' ')
  for (var a = 0; a < words.length; a++) {
    var w = words[a]
    words[a] = w[0].toUpperCase() + w.slice(1)
  }
  return words.join(' ')
}
