const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: String,
  mobileNo: String,
  emailId: String,
});

module.exports = mongoose.model('User', UserSchema);
