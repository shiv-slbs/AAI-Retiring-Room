// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
require('./db');
const mongoose = require('mongoose');


const Booking = require('./models/Booking');
const Room = require('./models/Room');
const User = require('./models/user');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Check user
app.post('/check-user', async (req, res) => {
  try {
    const { mobileNo, emailId } = req.body;
    const user = await User.findOne({ $or: [{ mobileNo }, { emailId }] });

    if (user) {
      return res.status(200).json({
        message: "User exists",
        userId: user._id
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error('❌ check-user error:', err);
    res.status(500).json({ message: "Server error" });
  }
});

// Register user
app.post('/submit', async (req, res) => {
  try {
    const { fullName, mobileNo, emailId } = req.body;

    if (!fullName || !mobileNo || !emailId) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const existingUser = await User.findOne({ $or: [{ mobileNo }, { emailId }] });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = new User({ fullName, mobileNo, emailId });
    const savedUser = await newUser.save();

    console.log("✅ User saved:", savedUser);
    res.status(200).json({ message: "User saved successfully", userId: savedUser._id });
  } catch (err) {
    console.error('❌ submit error:', err);
    res.status(500).json({ message: "Server error" });
  }
});

// for validation (optional)

app.post('/save-booking', async (req, res) => {
  try {
    const {
      userId,
      arrivalFlightNo,
      departureFlightNo,
      pnr,
      checkinDate,
      checkoutDate,
      roomType,
      startHour,
      endHour,
      hoursBooked,
      amount,
      gst,
      totalAmount
    } = req.body;

    // 🔍 Basic validation
    if (
      !userId || !arrivalFlightNo || !departureFlightNo || !pnr ||
      !checkinDate || !checkoutDate || !roomType ||
      startHour === undefined || endHour === undefined ||
      amount === undefined || gst === undefined || totalAmount === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // 🔍 Check if booking already exists for same user and PNR
    const existingBooking = await Booking.findOne({ userId, pnr });
    if (existingBooking) {
      return res.status(409).json({ message: "Booking already exists for this PNR and user." });
    }

    // 🧠 Calculate hoursBooked if not sent
    const calculatedHours = endHour - startHour;
    const booking = new Booking({
      userId,
      arrivalFlightNo,
      departureFlightNo,
      pnr,
      checkinDate: new Date(checkinDate),
      checkoutDate: new Date(checkoutDate),
      roomType,
      startHour,
      endHour,
      hoursBooked: hoursBooked || calculatedHours,
      amount,
      gst,
      totalAmount
    });

    const savedBooking = await booking.save();

    console.log("✅ Booking saved:", savedBooking);
    res.status(200).json({ message: "Booking saved successfully", bookingId: savedBooking._id });

  } catch (err) {
    console.error("❌ Booking save error:", err);
    res.status(500).json({ message: "Server error while saving booking." });
  }
});



app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
