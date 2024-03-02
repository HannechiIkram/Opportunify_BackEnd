const mongoose = require ('mongoose'); 
const {Schema} = mongoose

const userjobseekerSchema = new Schema({
    name: String,
    lastname: String,
    email: {
      type: String,
      unique: true  
  
    }, 
    birthdate:Date,
    phone: Number,
    adress:String,
    password: String,

   // resetPasswordToken: String,
    //resetPasswordExpires: Date,
  })
  const UserModel = mongoose.model('Userjobseeker', userjobseekerSchema)
  module.exports = UserModel;