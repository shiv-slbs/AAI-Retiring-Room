// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
require('./db'); // Initialize MongoDB connection

const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the frontend HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST: Add a new user
app.post('/submit', async (req, res) => {
  const { fullName, mobileNo, emailId } = req.body;

  if (!fullName || !mobileNo || !emailId) {
    return res.status(400).send('Missing required fields.');
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ emailId }, { mobileNo }]
    });

    if (existingUser) {
      return res.status(409).send('User already exists with this email or mobile number.');
    }

    const newUser = new User({ fullName, mobileNo, emailId });
    await newUser.save();

    console.log('✅ User saved:', newUser);
    res.status(200).send('User saved successfully.');
  } catch (err) {
    console.error('❌ Error saving user:', err);
    res.status(500).send('Internal server error.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
