import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  number: { type: String, required: true },
  imageUrl: { type: String }, // Store image URL or base64 string
}, { timestamps: true });

export default mongoose.model('Vehicle', vehicleSchema);