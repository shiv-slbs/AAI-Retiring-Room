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
  if (!fullName || !mobileNo || !emailId) {
    return res.status(400).send('Missing required fields.');
  }

  const newUser = {
    fullName,
    mobileNo,
    emailId,
    timestamp: new Date().toISOString()
  };

  const filePath = path.join(__dirname, 'data', 'users.json');

  let existingData = [];

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    if (fileContent.trim().length > 0) {
      try {
        existingData = JSON.parse(fileContent);
      } catch (err) {
        console.error('⚠️ Failed to parse users.json:', err);
        return res.status(500).send('Corrupted users.json file.');
      }
    }
  }

  existingData.push(newUser);
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

  console.log('✅ User saved:', newUser);
  res.send('User saved locally to users.json');
});


// Launch Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
