const mongoose = require ('mongoose'); 
const {Schema} = mongoose
///ikram
//ikram
const userCompanySchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true  
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

})


module.exports =mongoose.model('Usercompany', userCompanySchema) ;