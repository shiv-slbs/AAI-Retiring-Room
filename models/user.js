const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },
  email: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model('User', userSchema);
