const User = require('../models/User')
const Code = require('../models/Code')
const Team = require('../models/Team')
const ConfirmationCode = require('../models/ConfirmationCode')
const Trash = require('../models/Trash')
const responseCodes = require('../utils/responseCodes')
const { encrypt } = require('../utils/crypto')
const validator = require('email-validator')
const http = require('http')
const moment = require('moment')
const log = require('log4js').getLogger('app')
const jwt = require('jsonwebtoken')

module.exports = {

  async getUserById (req, res) {
    try {
      const { id } = req.params

      const user = await User.findById(id)

      return res.json(user)
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on getUserById')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  },
  async getAllUsers (req, res) {
    try {
      const users = await User.find().sort('createdAt')
      return res.json(users)
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on getAllUsers')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  },
  async createUser (req, res) {
    try {
      const { email, password, codeUsedToJoin, codeToShare, loginOption, teamName } = req.body
      var newCodeToShare = null

      const { requestValid, invalidFields } = checkRequest(req.body)
      if (!requestValid) return res.status(400).json({ status: 'error', code: responseCodes.CODE_003.CODE, message: `${responseCodes.CODE_003.MESSAGE}${invalidFields}` })

      const userRegistred = await checkIfEmailIsRegistred(email)
      if (userRegistred) return res.status(400).json({ status: 'error', code: responseCodes.CODE_002.CODE, message: responseCodes.CODE_002.MESSAGE })

      const emailIsValid = validator.validate(email)
      if (!emailIsValid) return res.status(400).json({ status: 'error', code: responseCodes.CODE_001.CODE, message: responseCodes.CODE_001.MESSAGE })

      const codeUsedToLoginRegistred = await findCode(codeUsedToJoin)
      if (codeUsedToJoin && !codeUsedToLoginRegistred.length > 0) return res.status(400).json({ status: 'error', code: responseCodes.CODE_004.CODE, message: responseCodes.CODE_004.MESSAGE })

      const encryptedPassword = checkLoginOption(loginOption, password)
      if (encryptedPassword) req.body.password = encryptedPassword

      const user = await createUser(req.body)

      let teamRegistred = {}
      // If we have codeUsedToJoin, we just search if the code and team already exist
      if (codeUsedToJoin) {
        user.codeUsedToJoin = codeUsedToLoginRegistred[0]._id

        teamRegistred = await getTeamFromCode(codeUsedToLoginRegistred[0])
        teamRegistred.members.push(user._id)
        await teamRegistred.save()

        var stopWhile = 0
        while (stopWhile === 0) {
          var newUserCode = Math.random().toString(36).substring(2, 6).toUpperCase()

          const isNewCodeRegistred = await findCode(newUserCode)
          if (isNewCodeRegistred.length === 0) {
            const newCode = await createCode(newUserCode)
            user.codeToShare = newCode._id
            newCode.owner = user._id
            await newCode.save()
            newCodeToShare = newUserCode
            stopWhile = 1
          }
        }

        user.team = teamRegistred._id
        await user.save()
      } else {
        // If we have codeToShare, we need to search if that code (and team) exist and create it if doesnt
        let codeRegistred = await findCode(codeToShare)
        if (!codeRegistred.length > 0) {
          codeRegistred = await createCode(codeToShare)
          codeRegistred.owner = user._id
          await codeRegistred.save()
          user.codeToShare = codeRegistred._id
        } else {
          user.codeToShare = codeRegistred[0]._id
        }

        await user.save()

        teamRegistred = await findTeam(teamName)
        if (teamRegistred === undefined) {
          teamRegistred = await createTeam(teamName)
        }

        user.team = teamRegistred._id
        await user.save()
        teamRegistred.leader = user._id
        teamRegistred.members.push(user._id)
        await teamRegistred.save()
      }

      jwt.sign({ user: user._id }, 'secretkey', { expiresIn: '30d' }, (err, token) => {
        if (err) {
          return res.status(401).json({ status: 'error', message: err })
        }
        var json = { status: 'success', userId: user._id, token }
        if (newCodeToShare) {
          json.code = newCodeToShare
        }
        return res.status(200).json(json)
      })
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on createUser')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  },
  async deleteUserById (req, res) {
    try {
      await User.deleteOne({ _id: req.params.id })
      return res.json({ ok: true })
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on deleteUserById')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  },
  async createUserByList (req, res) {
    try {
      const { userList } = req.body
      var returns = []

      for (var i in userList) {
        var response = await requestCreateUser(userList[i])

        returns.push(response)
      }

      return res.json(returns)
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on createUserByList')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  },
  async changePassword (req, res) {
    try {
      const { id } = req.params
      const { newPassword, confirmationCode } = req.body
      const user = await User.findById(id)

      if (!user) return res.status(400).json({ status: 'error', code: responseCodes.CODE_011.CODE, message: responseCodes.CODE_011.MESSAGE })

      const { confirmationCodeValidated, confirmationCodeExpirationValidated } = await checkConfirmationCode(user.email, confirmationCode)

      if (!confirmationCodeExpirationValidated) return res.status(400).json({ status: 'error', code: responseCodes.CODE_014.CODE, message: responseCodes.CODE_014.MESSAGE })
      if (!confirmationCodeValidated) return res.status(400).json({ status: 'error', code: responseCodes.CODE_013.CODE, message: responseCodes.CODE_013.MESSAGE })

      user.password = encrypt(newPassword)
      await user.save()

      return res.status(200).json({ status: 'success' })
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on changePassword')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  },
  async deleteAllData (req, res) {
    await User.deleteMany()
    await Team.deleteMany()
    await Code.deleteMany()
    await ConfirmationCode.deleteMany()
    await Trash.deleteMany()
    return res.json({ ok: true })
  }
}

async function requestCreateUser (user) {
  var p1 = new Promise((resolve, reject) => {
    const postOptions = {
      host: 'localhost',
      port: process.env.PORT || 3000,
      path: '/user',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const postReq = http.request(postOptions, function (res) {
      res.setEncoding('utf8')
      res.on('data', function (chunk) {
        resolve({ email: user.email, response: chunk })
      })
    })
    postReq.write(JSON.stringify(user))
    postReq.end()
  })

  return p1
}

function checkRequest (request) {
  const { name, email, password, codeUsedToJoin, codeToShare, loginOption, teamName } = request

  const invalidFields = []

  if (!name) {
    invalidFields.push('Campo nome vazio')
  }
  if (!email) {
    invalidFields.push('Campo email vazio')
  }
  if (!(loginOption === 'google' || loginOption === 'facebook') && !password) {
    invalidFields.push('Campo password vazio')
  }
  if (!codeUsedToJoin && !codeToShare) {
    invalidFields.push('Campos codeUsedToJoin e codeToShare estão vazios: é necessário passar pelo menos um deles')
  }
  if (codeToShare) {
    if (!teamName) {
      invalidFields.push('Campo teamName vazio')
    }
  }
  if (loginOption !== 'desafio2020' && loginOption !== 'google' && loginOption !== 'facebook') {
    invalidFields.push('Campo loginOption inválido')
  }

  return { requestValid: invalidFields.length === 0, invalidFields }
}

async function checkIfEmailIsRegistred (email) {
  const userRegistred = await User.find({ email })
  return userRegistred.length > 0
}

async function createUser (request) {
  const { email, name, code, password, loginOption } = request

  const user = await User.create({
    email,
    name,
    code,
    password,
    loginOption
  })

  return user
}

async function createCode (codeToShare) {
  const code = await Code.create({ code: codeToShare })

  return code
}

async function findCode (code) {
  const codeRegistred = await Code.find({ code })
  return codeRegistred
}

function checkLoginOption (loginOption, password) {
  if (loginOption === 'desafio2020') {
    return encrypt(password)
  }
  return false
}

async function getTeamFromCode (codeRegistred) {
  const user = await User.findById(codeRegistred.owner)
  const team = await Team.findById(user.team)

  return team
}

async function findTeam (name) {
  const team = await Team.find({ name })

  return team[0]
}

async function createTeam (name) {
  const team = await Team.create({ name: name })

  return team
}

async function checkConfirmationCode (email, confirmationCode) {
  const dateNow = moment(Date.now()).unix()
  const confirmationCodeList = await ConfirmationCode.find({ email })
  const currentConfirmationCode = confirmationCodeList.filter(confirmationCode => confirmationCode.current)
  const confirmationCodeEncrypted = encrypt(confirmationCode)
  return {
    confirmationCodeValidated: confirmationCodeEncrypted === currentConfirmationCode[0].code,
    confirmationCodeExpirationValidated: dateNow - moment(currentConfirmationCode[0].createdAt).unix() < process.env.CODE_EXPIRATION_TIME
  }
}
