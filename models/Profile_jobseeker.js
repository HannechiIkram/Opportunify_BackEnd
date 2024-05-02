const mongoose = require('mongoose');
const { Schema } = mongoose;

const profileJobSeekerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "UserJobSeeker", // Assuming you have a model named UserJobSeeker
    required: true,
  },
  name: String,
  email: String,
  lastname: String,
  birthdate: Date,
  phone: Number,
  address: String,
  role_jobseeker: {
    type: String,
    enum: ["student", "alumni", "staff"],
  },
  password: { type: String, required: true },
  facebook_url:String,
   instagram_url:String,
   git_url:String,
  description:String,
  technologies: [{ type: String }], // Add a new field for technologies
  image: String 

});

module.exports = mongoose.model('ProfileJobSeeker', profileJobSeekerSchema);