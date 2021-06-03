const mongoose = require('../database')

const CodeSchema = new mongoose.Schema({
  code: {
    type: String,
    require: true,
    unique: true
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Code', CodeSchema)
