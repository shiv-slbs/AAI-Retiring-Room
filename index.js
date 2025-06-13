// Required Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

// Setup Express App
const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
/*
mongoose.connect('mongodb+srv://slbs-shiv:Shiva@243445@clusteraai.l4typb5.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAAI', 
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
*/

// User Schema
/*
const UserSchema = new mongoose.Schema({
    fullName: String,
    mobileNo: String,
    emailId: String,
});

const User = mongoose.model('User', UserSchema);
*/
// Booking Schema
/*
const bookingSchema = new mongoose.Schema({
    fullName: String,
    mobileNo: String,
    emailId: String,
    arrivalFlightNo: String,
    departureFlightNo: String,
    checkInDate: String,
    checkOutDate: String,
    roomType: String,
    totalStayHours: Number,
});

const Booking = mongoose.model('Booking', bookingSchema);
*/
// Define Server Port
const PORT = process.env.PORT || 5000;

// Serve HTML File
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle User Form Submission

/*
app.post('/submit', async (req, res) => {
    const { fullName, mobileNo, emailId } = req.body;

    // Log Received Data
    console.log('Data Received:', { fullName, mobileNo, emailId });

    // Save User to MongoDB
    const user = new User({ fullName, mobileNo, emailId });
    await user.save();

    // Send Response
    res.send('Data submitted successfully');
});
*/

// Handle Booking Submission

/*
app.post('/api/book', async (req, res) => {
    const newBooking = new Booking(req.body);

    try {
        await newBooking.save();
        res.status(201).send('Booking stored successfully');
    } catch (err) {
        res.status(400).send('Error storing booking: ' + err);
    }
});
*/

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Frontend Interaction Script

/*
document.getElementById('proceedButton').addEventListener('click', async () => {
    const bookingData = {
        fullName: document.getElementById('fullNameInput').value,
        mobileNo: document.getElementById('mobileNoInput').value,
        emailId: document.getElementById('emailInput').value,
        // Add additional booking fields as necessary...
    };

    const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
    });

    if (response.ok) {
        alert('Booking stored successfully.');
        // Redirect or update the UI as needed
    } else {
        alert('Error storing booking.');
    }
});

*/