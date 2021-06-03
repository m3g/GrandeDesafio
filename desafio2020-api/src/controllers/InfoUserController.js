const User = require('../models/User')
const Team = require('../models/Team')
const responseCodes = require('../utils/responseCodes')
const { encrypt } = require('../utils/crypto')
const log = require('log4js').getLogger('app')
const jwt = require('jsonwebtoken')

module.exports = {
  async login (req, res) {
    try {
      const { email, password, loginOption } = req.body
      const user = await User.findOne({ email }).populate('codeToShare')
      if (!user) {
        if (loginOption === 'google' || loginOption === 'facebook') {
          return res.status(400).json({ status: 'error', code: responseCodes.CODE_016.CODE, message: responseCodes.CODE_016.MESSAGE })
        } else {
          return res.status(400).json({ status: 'error', code: responseCodes.CODE_010.CODE, message: responseCodes.CODE_010.MESSAGE })
        }
      }

      if (user.loginOption !== loginOption) {
        return res.status(400).json({ status: 'error', code: responseCodes.CODE_010.CODE, message: responseCodes.CODE_010.MESSAGE })
      }

      if (user.loginOption === 'desafio2020') {
        const passwordChecked = checkPassword(user, password)
        if (!passwordChecked) return res.status(400).json({ status: 'error', code: responseCodes.CODE_010.CODE, message: responseCodes.CODE_010.MESSAGE })
      } else {
        if (user.loginOption !== loginOption) return res.status(400).json({ status: 'error', code: responseCodes.CODE_010.CODE, message: responseCodes.CODE_010.MESSAGE })
      }
      jwt.sign({ user: user._id }, 'secretkey', { expiresIn: '30d' }, (err, token) => {
        if (err) {
          return res.status(401).json({ status: 'error', message: err })
        }
        return res.status(200).json({ status: 'success', userId: user.id, name: user.name, code: user.codeToShare.code, token })
      })
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on login')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  },
  async statistcs (req, res) {
    try {
      const { id } = req.params
      let personalPoints = 0
      // const personalWeight = 0
      const personalTrashCategory = []

      const userRegistred = await User.findById(id).populate('trashs')

      userRegistred.trashs.forEach(trash => {
        personalPoints += 1

        let isCreate = true
        for (let i = 0; i < personalTrashCategory.length; i++) {
          if (personalTrashCategory[i].type === trash.type) {
            personalTrashCategory[i].total += 1
            isCreate = false
            break
          }
        }
        if (isCreate) personalTrashCategory.push({ type: trash.type, total: 1 })
      })

      return res.json({ status: 'success', personalPoints: personalPoints, personalTrashCategory: personalTrashCategory })
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on statistcs')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  },
  async ranking (req, res) {
    try {
      const { option, userId } = req.body
      var list = []

      if (option === 'individual') {
        const users = await User.find().populate('trashs')

        users.forEach(user => {
          var userLogged = userId === user._id.toString()
          list.push({ name: user.name, points: user.trashs.length, userLogged: userLogged })
        })
      } else {
        const teams = await Team.find().populate({
          path: 'members',
          populate: { path: 'trashs' }
        })

        if (teams != null) {
          teams.forEach(team => {
            var userLogged = false
            var teamPoints = 0
            team.members.forEach(members => {
              userLogged = userId === members._id.toString() ? true : userLogged || false
              members.trashs.forEach(trash => {
                teamPoints += 1
              })
            })
            list.push({ name: team.name, points: teamPoints, userLogged: userLogged })
          })
        }
      }
      list.sort(function (a, b) { return b.points - a.points })

      return res.json({ status: 'success', list: list })
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on ranking')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  }
}

function checkPassword (user, password) {
  const encryptedPassword = encrypt(password)

  return user.password === encryptedPassword
}
