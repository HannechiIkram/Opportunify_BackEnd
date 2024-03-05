const mongoose = require('mongoose'); 
const { Schema } = mongoose;

const userJobSeekerSchema = new Schema({
  
    name: String,
  lastname: String,
  email: {
    type: String,
    unique: true  
  }, 
  birthdate: Date,
  phone: Number,
  address: String,
  password: String,
  role_jobseeker: { type: String, enum: ['student', 'alumni', 'staff'] }
});

module.exports= mongoose.model('UserJobSeeker', userJobSeekerSchema);
