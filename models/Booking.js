const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  arrivalFlightNo: {
    type: String,
    required: true
  },
  departureFlightNo: {
    type: String,
    required: true
  },
  pnr: {
    type: String,
    required: true
  },
  checkinDate: {
    type: Date,
    required: true
  },
  checkoutDate: {
    type: Date,
    required: true
  },
  roomType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  startHour: {
    type: Number,
    required: true
  },
  endHour: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  gst: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
