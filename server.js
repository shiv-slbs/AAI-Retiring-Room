  const express = require('express');
  const mongoose = require('mongoose');
  const bodyParser = require('body-parser');
  
  const app = express();
  
  // Middleware
  app.use(bodyParser.json());
  
  // MongoDB connection string
  const dbURI = 'mongodb+srv://slbs-shiv:Shiva@243445@clusteraai.l4typb5.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAAI';
  
  mongoose
    .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

  // Server setup
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
