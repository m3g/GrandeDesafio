const mongoose = require('../database')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String
  },
  loginOption: {
    type: String,
    required: true
  },
  codeUsedToJoin: {
    type: mongoose.Types.ObjectId,
    ref: 'Code'
  },
  codeToShare: {
    type: mongoose.Types.ObjectId,
    ref: 'Code'
  },
  trashs: [{
    type: mongoose.Types.ObjectId,
    ref: 'Trash'
  }],
  team: {
    type: mongoose.Types.ObjectId,
    ref: 'Team'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', UserSchema)
