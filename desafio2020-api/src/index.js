require('dotenv').config()
const express = require('express')
const cors = require('cors')
const log4js = require('log4js')

log4js.configure('./src/config/log4js.json')
const log = log4js.getLogger('app')

const api = express()

api.use(cors())
api.use(express.json())
api.use(express.urlencoded({ extended: true }))
api.use(require('./routes'))

log.debug('The app has started successfully')

api.listen(process.env.PORT || 3000)
