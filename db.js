const mongoose = require('mongoose');
require('dotenv').config(); // Load variables from .env

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Connected!');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
