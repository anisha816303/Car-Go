import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './models/User.js'; // Using ES Module import syntax
import client from 'prom-client';
import Ride from './models/rides.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// eslint-disable-next-line no-undef
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {console.log('MongoDB connected');
        await User.init();
        await Ride.init(); // Ensure Ride model is initialized
    })
    .catch((err) => console.log('MongoDB connection error:', err));


app.post('/register', async (req, res) => {
    const { fname, lname, username, email, password } = req.body;
    console.log(req.body);
    try {
        const newUser = new User({ fname, lname, username, email, password });
        await newUser.save();
        res.status(201).json({ userId: newUser._id, message: 'User registered successfully' });
    } 
catch (err) {
    if (err.code === 11000) {
        res.status(409).json({ error: 'Username already exists' });
    } else {
        res.status(500).json({ error: 'Failed to register user' });
    }
}

       
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        res.status(200).json({ message: 'Login successful', user: { _id: user._id, uname: user.uname, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});
app.post('/rides', async (req, res) => {
    const { source, destination, user } = req.body; // user should be a User _id
    try {
        const newRide = new Ride({ source, destination, user });
        await newRide.save();
        console.log('New ride created:', newRide);
         // Log the new ride
        res.status(201).json({ rideId: newRide._id, message: 'Ride created successfully' });
    } catch (err) {
        console.error('Error creating ride:', err, 'Request body:', req.body);
        res.status(500).json({ error: 'Failed to create ride' });
    }
});
// Find rides by source and destination
app.get('/rides', async (req, res) => {
    const { source, destination } = req.query;
    const query = {};
    if (source) query.source = source;
    if (destination) query.destination = destination;
    try {
        // Populate user info (name, username)
        const rides = await Ride.find(query).populate('user', 'fname lname username');
        res.status(200).json(rides);
    } catch (err) {
        console.error('Error fetching rides:', err);
        res.status(500).json({ error: 'Failed to fetch rides' });
    }
});

// Prometheus metrics setup
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0',() => {
    console.log(`Server is running on port ${PORT}`);
});
