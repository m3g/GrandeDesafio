const mongoose = require('../database')

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  members: [{
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }],
  leader: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Team', TeamSchema)
