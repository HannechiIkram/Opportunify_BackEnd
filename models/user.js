 
const mongoose = require('mongoose');
const { rolePermissions } = require('../helpers/permissions');

const userSchema = new mongoose.Schema({
  name:String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['job_seeker', 'company', 'admin'], required: true },
  permissions: {
    type: Object,
    default: {},
    select: false 
  },
  resetToken: String,
  resetTokenExpires: Date,
  image: String 
});

// Add permissions based on user role
userSchema.pre('save', function(next) {
  const role = this.role;
  this.permissions = rolePermissions[role] || {};
  next();
});

module.exports = mongoose.model('User', userSchema);
