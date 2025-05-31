import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './models/User.js'; // Using ES Module import syntax

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {console.log('MongoDB connected');
        await User.init(); // Ensure User model is initialized
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

        res.status(200).json({ message: 'Login successful', user: { uname: user.uname, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0',() => {
    console.log(`Server is running on port ${PORT}`);
});
