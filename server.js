const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./server');
const User = require('./models/user');
const Booking = require('./models/Booking');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Serve static frontend from /public
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle User form
app.post('/submit', async (req, res) => {
  const { fullName, mobileNo, emailId } = req.body;
  try {
    const user = new User({ fullName, mobileNo, emailId });
    await user.save();
    res.send('User submitted successfully');
  } catch (err) {
    res.status(400).send('Error saving user: ' + err.message);
  }
});

// Handle booking
app.post('/api/book', async (req, res) => {
  const newBooking = new Booking(req.body);
  try {
    await newBooking.save();
    res.status(201).send('Booking stored successfully');
  } catch (err) {
    res.status(400).send('Error storing booking: ' + err.message);
  }
});

// Start server after DB is connected
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
});
