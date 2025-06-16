const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML SPA
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST: Save user to users.json
app.post('/submit', (req, res) => {
  const { fullName, mobileNo, emailId } = req.body;
  const newUser = { fullName, mobileNo, emailId };

  const filePath = path.join(__dirname, 'data', 'users.json');
  let existingData = [];

  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath);
      existingData = raw.length ? JSON.parse(raw) : [];
    } catch (err) {
      return res.status(500).send("Failed to read existing user data.");
    }
  }

  const isDuplicate = existingData.some(user =>
    user.emailId === emailId || user.mobileNo === mobileNo
  );

  if (isDuplicate) {
    return res.status(409).send("User already exists with this email or mobile number.");
  }

  existingData.push(newUser);

  try {
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
    console.log('User saved:', newUser);
    res.send('User saved successfully.');
  } catch (err) {
    res.status(500).send("Failed to save user.");
  }
});


// Launch Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
