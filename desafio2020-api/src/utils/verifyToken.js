const jwt = require('jsonwebtoken')
const responseCodes = require('./responseCodes')

function verifyToken (req, res, next) {
  const bearerHeader = req.headers.authorization

  if (bearerHeader) {
    const bearerParts = bearerHeader.split(' ')
    const bearerToken = bearerParts[1]
    jwt.verify(bearerToken, 'secretkey', (err) => {
      if (err) {
        return res.status(401).json({ status: 'error', code: responseCodes.CODE_017.CODE, message: responseCodes.CODE_017.MESSAGE })
      }
      req.token = bearerToken
      next()
    })
  } else {
    return res.status(401).json({ status: 'error', code: responseCodes.CODE_017.CODE, message: responseCodes.CODE_017.MESSAGE })
  }
}

module.exports = verifyToken
