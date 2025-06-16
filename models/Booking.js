const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  fullName: String,
  mobileNo: String,
  emailId: String,
  arrivalFlightNo: String,
  departureFlightNo: String,
  checkInDate: String,
  checkOutDate: String,
  roomType: String,
  totalStayHours: Number,
});

module.exports = mongoose.model('Booking', BookingSchema);
