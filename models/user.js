 
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:String,
  address: String,

image: {
  type: String, 
 
}, 

email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['job_seeker', 'company', 'admin'], required: false },
 
  phone: Number,
  description: String,
  accepted: { type: Boolean, default: true },

  lastname: String,
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
  },
  phoneNumber: String,
  isBlocked: { type: Boolean, default: false },
  resetToken: String,
  resetTokenExpires: Date,
});



module.exports = mongoose.model('User', userSchema);
