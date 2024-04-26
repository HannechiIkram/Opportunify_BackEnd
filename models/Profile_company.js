// profileCompanyModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const profileCompanySchema = new mongoose.Schema({
  userCid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  matriculeFiscale: String,
  description: String,
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
  },
  address: String,
  phoneNumber: String,
  domainOfActivity: String,
  resetToken: String,
  resetTokenExpires: Date,
  image: String,
  
  // Add more fields as needed
});

module.exports = mongoose.model('ProfileCompany', profileCompanySchema);
