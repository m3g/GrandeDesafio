const Trash = require('../models/Trash')
const User = require('../models/User')
const responseCodes = require('../utils/responseCodes')
const log = require('log4js').getLogger('app')

module.exports = {

  async getTrashById (req, res) {
    try {
      const { id } = req.params

      const trash = await Trash.findById(id)

      return res.json(trash)
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on getTrashById')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  },
  async getAllTrashs (req, res) {
    try {
      const trashs = await Trash.find().sort('createdAt')
      return res.json(trashs)
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on getAllTrashs')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  },
  async createTrash (req, res) {
    try {
      const { user } = req.body

      const userRegistred = await findUser(user)
      if (userRegistred === null) return res.status(400).json({ status: 'error', code: responseCodes.CODE_007.CODE, message: responseCodes.CODE_007.MESSAGE })

      const { requestValid, invalidFields } = checkRequest(req.body)
      if (!requestValid) return res.status(400).json({ status: 'error', code: responseCodes.CODE_006.CODE, message: `${responseCodes.CODE_006.MESSAGE}${invalidFields}` })

      const trash = await createTrash(req.body)
      userRegistred.trashs.push(trash)

      await userRegistred.save()

      return res.status(200).json({ status: 'success', data: { trashId: trash._id } })
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on createTrash')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  },
  async deleteTrashById (req, res) {
    try {
      await Trash.deleteOne({ _id: req.params.id })
      return res.json({ ok: true })
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on deleteTrashById')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  }
}

function checkRequest (request) {
  const { user, latitude, longitude, type, weight, points } = request

  const invalidFields = []

  if (!user) {
    invalidFields.push('Campo user vazio')
  }
  if (!latitude) {
    invalidFields.push('Campo latitude vazio')
  }
  if (!longitude) {
    invalidFields.push('Campo longitude vazio')
  }
  if (!type) {
    invalidFields.push('Campo type vazio')
  }
  if (!weight) {
    invalidFields.push('Campo weight vazio')
  }
  if (!points) {
    invalidFields.push('Campo points vazio')
  }

  return { requestValid: invalidFields.length === 0, invalidFields }
}

async function createTrash (request) {
  const { user, latitude, longitude, type, weight, points } = request

  const trash = await Trash.create({
    user,
    latitude,
    longitude,
    type,
    weight,
    points
  })

  return trash
}

async function findUser (id) {
  const userRegistred = await User.findById(id)
  return userRegistred
}
