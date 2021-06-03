const Team = require('../models/Team')
const responseCodes = require('../utils/responseCodes')
const log = require('log4js').getLogger('app')

module.exports = {
  async getTeamById (req, res) {
    try {
      const { id } = req.params

      const team = await Team.findById(id).populate({
        path: 'members',
        populate: { path: 'trashs' }
      })

      let teamPoints = 0

      team.members.forEach(members => {
        members.trashs.forEach(trash => {
          teamPoints += trash.points
        })
      })

      return res.json({ team: team.name, teamPoints: teamPoints })
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on getTeamById')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  },
  async getAllTeams (req, res) {
    try {
      var teamsList = []

      const teams = await Team.find().populate({
        path: 'members',
        populate: { path: 'trashs' }
      })

      if (teams != null) {
        teams.forEach(team => {
          var teamPoints = 0
          team.members.forEach(members => {
            members.trashs.forEach(trash => {
              teamPoints += trash.points
            })
          })
          teamsList.push({ team: team.name, points: teamPoints })
        })

        teamsList.sort(function (a, b) { return b.points - a.points })
      }

      return res.json({ status: 'success', teams: teamsList })
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on getAllTeams')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  },
  async createTeam (req, res) {
    try {
      const { name } = req.param

      const codeRegistred = await Team.find({ name })
      if (codeRegistred.length > 0) return res.status(400).json({ status: 'error', code: responseCodes.CODE_009.CODE, message: responseCodes.CODE_009.MESSAGE })

      const team = await createTeam(req.body)
      return res.status(200).json({ status: 'success', data: { userId: team._id } })
    } catch (error) {
      log.error('-------------------------')
      log.error('Error on createTeam')
      log.error(req.body)
      log.error(req.headers)
      log.error(error)
      return res.status(500).json({ status: 'error', code: responseCodes.CODE_999.CODE, message: responseCodes.CODE_999.MESSAGE })
    }
  }
}

async function createTeam (request) {
  const { name } = request

  const user = await Team.create({
    name
  })

  return user
}
