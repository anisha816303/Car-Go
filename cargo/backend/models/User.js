import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  uname: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

export default User; 
