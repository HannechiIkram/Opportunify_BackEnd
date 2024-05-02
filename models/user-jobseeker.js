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
  password: String,
// Autres champs de votre modèle...
image: {
  type: String, // Type de données pour l'URL de l'image
  // Autres options de champ si nécessaire...
},  
role_jobseeker: { type: String, enum: ['student', 'alumni', 'staff'] }


});

module.exports= mongoose.model('UserJobSeeker', userJobSeekerSchema);

