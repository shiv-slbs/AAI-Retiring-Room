const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['UPI', 'Net Banking', 'Credit/Debit Card', 'Wallet', 'Pay at Counter']
  },
  status: {
    type: String,
    default: 'Confirmed'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
