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
// Autres champs de votre modèle...
image: {
  type: String, // Type de données pour l'URL de l'image
  // Autres options de champ si nécessaire...
},
accepted: { type: Boolean, default: true },
isApproved: {
  type: Boolean,
  default: false,
},
isValidated: { type: Boolean, default: false }, // Nouveau champ pour validation


})


module.exports =mongoose.model('Usercompany', userCompanySchema) ;