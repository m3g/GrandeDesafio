const mongoose = require('mongoose')

const ConfirmationCodeSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  current: {
    type: Boolean,
    required: true
  },
  checked: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('ConfirmationCode', ConfirmationCodeSchema)
