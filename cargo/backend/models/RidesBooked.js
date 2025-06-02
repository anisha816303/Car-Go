import mongoose from 'mongoose';

const ridebookedSchema = new mongoose.Schema({
 ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seatsBooked: { type: Number, default: 1 },
  bookedAt: { type: Date, default: Date.now },
driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const RideBooked = mongoose.model('RideBooked', ridebookedSchema);

export default RideBooked;