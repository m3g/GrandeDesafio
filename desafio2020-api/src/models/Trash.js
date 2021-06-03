const mongoose = require('../database')

const TrashSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    require: true
  },
  image: {
    type: String
    // require: true
  },
  latitude: {
    type: String,
    require: true
  },
  longitude: {
    type: String,
    require: true
  },
  type: {
    type: String,
    require: true
  },
  weight: {
    type: String,
    require: true
  },
  points: {
    type: Number,
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Trash', TrashSchema)
