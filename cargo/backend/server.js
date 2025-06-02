import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './models/User.js'; // Using ES Module import syntax
import client from 'prom-client';
import Ride from './models/rides.js';
import Vehicle from './models/Vehicle.js'; // Import the Vehicle model
import RideBooked from './models/RidesBooked.js'; // Import the RideBooked model
import multer from 'multer';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// eslint-disable-next-line no-undef
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {console.log('MongoDB connected');
        await User.init();
        await Ride.init();
        await Vehicle.init(); 
        await RideBooked.init();
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

// Book a ride endpoint
app.post('/book-ride', async (req, res) => {
    const { rideId, userId, driverId, seatsBooked = 1 } = req.body;
    
    try {
        // Validate required fields
        if (!rideId || !userId || !driverId) {
            return res.status(400).json({ error: 'Missing required fields: rideId, userId, or driverId' });
        }

        // Check if the ride exists
        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ error: 'Ride not found' });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if driver exists
        const driver = await User.findById(driverId);
        if (!driver) {
            return res.status(404).json({ error: 'Driver not found' });
        }

        // Prevent users from booking their own rides
        if (userId === driverId) {
            return res.status(400).json({ error: 'You cannot book your own ride' });
        }

        // Check if user has already booked this ride
        const existingBooking = await RideBooked.findOne({ 
            ride: rideId, 
            user: userId 
        });
        
        if (existingBooking) {
            return res.status(409).json({ error: 'You have already booked this ride' });
        }

        // Create new booking
        const newBooking = new RideBooked({
            ride: rideId,
            user: userId,
            driver: driverId,
            seatsBooked: seatsBooked
        });

        await newBooking.save();
        console.log('New ride booking created:', newBooking);

        res.status(201).json({ 
            bookingId: newBooking._id, 
            message: 'Ride booked successfully',
            booking: newBooking
        });

    } catch (err) {
        console.error('Error booking ride:', err);
        res.status(500).json({ error: 'Failed to book ride' });
    }
});

// Get all bookings for a user (as passenger)
app.get('/user/:id/bookings', async (req, res) => {
    try {
        const bookings = await RideBooked.find({ user: req.params.id })
            .populate('ride')
            .populate('driver', 'fname lname username')
            .populate('user', 'fname lname username')
            .sort({ bookedAt: -1 }); // Most recent first
        
        res.status(200).json(bookings);
    } catch (err) {
        console.error('Error fetching user bookings:', err);
        res.status(500).json({ error: 'Failed to fetch user bookings' });
    }
});

// Get all bookings for rides offered by a user (as driver)
app.get('/user/:id/ride-bookings', async (req, res) => {
    try {
        const bookings = await RideBooked.find({ driver: req.params.id })
            .populate('ride')
            .populate('user', 'fname lname username')
            .sort({ bookedAt: -1 }); // Most recent first
        
        res.status(200).json(bookings);
    } catch (err) {
        console.error('Error fetching ride bookings:', err);
        res.status(500).json({ error: 'Failed to fetch ride bookings' });
    }
});

// Cancel a booking
app.delete('/bookings/:bookingId', async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { userId } = req.body; // User making the cancellation request
        
        const booking = await RideBooked.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Only allow the user who made the booking to cancel it
        if (booking.user.toString() !== userId) {
            return res.status(403).json({ error: 'You can only cancel your own bookings' });
        }

        await RideBooked.findByIdAndDelete(bookingId);
        res.status(200).json({ message: 'Booking cancelled successfully' });
        
    } catch (err) {
        console.error('Error cancelling booking:', err);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
});

// User profile endpoints
app.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

app.put('/user/:id', async (req, res) => {
    try {
        const updates = req.body;
        if (updates.password) delete updates.password; // Prevent password change here
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true, select: '-password' }
        );
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'Profile updated', user });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

app.delete('/user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

app.get('/user/:id/rides', async (req, res) => {
    try {
        const rides = await Ride.find({ user: req.params.id })
            .populate('user', 'fname lname username')
            .sort({ createdAt: -1 }); // Most recent first
        res.status(200).json(rides);
    } catch (err) {
        console.error('Error fetching user rides:', err);
        res.status(500).json({ error: 'Failed to fetch user rides' });
    }
});

app.delete('/rides/:id', async (req, res) => {
    try {
        const ride = await Ride.findByIdAndDelete(req.params.id);
        if (!ride) return res.status(404).json({ error: 'Ride not found' });
        res.json({ message: 'Ride deleted' });
    } catch (err) {
        console.error('Error deleting ride:', err);
        res.status(500).json({ error: 'Failed to delete ride' });
    }
});

app.put('/rides/:id', async (req, res) => {
    try {
        const updates = req.body;
        const ride = await Ride.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        );
        if (!ride) return res.status(404).json({ error: 'Ride not found' });
        res.json({ message: 'Ride updated', ride });
    } catch (err) {
        console.error('Error updating ride:', err);
        res.status(500).json({ error: 'Failed to update ride' });
    }
});

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/vehicles/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, ''));
  }
});
const upload = multer({ storage });

// Serve uploaded images statically
app.use('/uploads/vehicles', express.static('uploads/vehicles'));

// Add a vehicle
app.post('/user/:id/vehicles', upload.single('image'), async (req, res) => {
  try {
    const { make, model, number } = req.body;
    const imageUrl = req.file ? `/uploads/vehicles/${req.file.filename}` : '';
    const vehicle = new Vehicle({
      user: req.params.id,
      make,
      model,
      number,
      imageUrl
    });
    await vehicle.save();
    res.status(201).json({ message: 'Vehicle added', vehicle });
  } catch (err) {
    console.error('Error adding vehicle:', err);
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
});

// Get all vehicles for a user
app.get('/user/:id/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
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