const express = require('express')
const multer = require('multer')
const multerConfig = require('./config/multer')
const routes = express.Router()
const verifyToken = require('./utils/verifyToken')

const UserController = require('./controllers/UserController')
const TrashController = require('./controllers/TrashController')
const ImageController = require('./controllers/ImageController')
const TeamController = require('./controllers/TeamController')
const CodeController = require('./controllers/CodeController')
const InfoUserController = require('./controllers/InfoUserController')
const ConfirmationCodeController = require('./controllers/ConfirmationCodeController')

routes.post('/user', UserController.createUser)
routes.post('/user/list', UserController.createUserByList)
routes.get('/user/all', verifyToken, UserController.getAllUsers)
routes.get('/user/:id', verifyToken, UserController.getUserById)
routes.delete('/user/:id', verifyToken, UserController.deleteUserById)
routes.patch('/user/:id/password', UserController.changePassword)

routes.post('/user/login', InfoUserController.login)
routes.get('/user/statistics/:id', verifyToken, InfoUserController.statistcs)
routes.post('/user/ranking', verifyToken, InfoUserController.ranking)

routes.post('/trash', verifyToken, TrashController.createTrash)
routes.get('/trash/all', verifyToken, TrashController.getAllTrashs)
routes.get('/trash/:id', verifyToken, TrashController.getTrashById)
routes.delete('/trash/:id', verifyToken, TrashController.deleteTrashById)

routes.post('/image', multer(multerConfig).single('file'), ImageController.uploadImage)

routes.post('/team', TeamController.createTeam)
routes.get('/team/all', verifyToken, TeamController.getAllTeams)
routes.get('/team/:id', verifyToken, TeamController.getTeamById)

routes.get('/code/checkCode/:code', CodeController.checkCode)
routes.get('/code/:code', CodeController.getCodeAndTeam)

routes.post('/confirmationCode', ConfirmationCodeController.sendCode)
routes.get('/confirmationCode/:email', ConfirmationCodeController.getConfirmationCodeByEmail)
routes.delete('/confirmationCode/:email', ConfirmationCodeController.deleteAllCodes)

routes.delete('/all/data', UserController.deleteAllData)

module.exports = routes
