const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect('process.env.MONGO_URI', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
})
.catch((err) => {
  console.error('❌ MongoDB Connection Failed:', err.message);
});