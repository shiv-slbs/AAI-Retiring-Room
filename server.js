const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Submit user details and save to users.json
app.post('/submit', (req, res) => {
  const { fullName, mobileNo, emailId } = req.body;
  const newUser = { fullName, mobileNo, emailId };

  const filePath = path.join(__dirname, 'data', 'users.json');
  const existingData = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];

  existingData.push(newUser);
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

  console.log('User saved:', newUser);
  res.send('User saved locally to users.json');
});

// Store booking in bookings.json
app.post('/api/book', (req, res) => {
  const booking = req.body;

  const filePath = path.join(__dirname, 'data', 'bookings.json');
  const existingData = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];

  existingData.push(booking);
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

  console.log('Booking saved:', booking);
  res.send('Booking saved locally to bookings.json');
});

// Start server
app.listen( PORT, () => console.log(`📝 Temporary server running at http://localhost:${PORT}`));
