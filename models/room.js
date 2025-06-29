const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  ratePerHour: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Room', roomSchema);
