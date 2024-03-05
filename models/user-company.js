const mongoose = require ('mongoose'); 
const {Schema} = mongoose
///ikram
//ikram
const userSchema = new Schema({
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
    // ... add other social media fields as needed
  },
  address: String,
  phoneNumber: String,
  domainOfActivity: String,
  resetToken: String,
  resetTokenExpires: Date

})


const UserCompanyModel = mongoose.model('User-company', userSchema)
module.exports = UserCompanyModel;