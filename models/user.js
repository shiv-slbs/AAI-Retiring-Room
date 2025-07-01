const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  mobileNo: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },
  emailId: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model('User', userSchema);
