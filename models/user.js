 
const mongoose = require('mongoose');
const { rolePermissions } = require('../helpers/permissions');

const userSchema = new mongoose.Schema({
  name:String,
  address: String,

image: {
  type: String, 
 
}, 

email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['job_seeker', 'company', 'admin'], required: false },
  permissions: {
    type: Object,
    default: {},
    select: false 
  },

  
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
  //////
  mfaCode: {
    type: Number,
    default: null // Set the default value to null
}
});

// Add permissions based on user role
userSchema.pre('save', function(next) {
  const role = this.role;
  this.permissions = rolePermissions[role] || {};
  next();
});

module.exports = mongoose.model('User', userSchema);
