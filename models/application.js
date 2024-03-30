const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const JobOffer = require("./job_offer"); 

const applicationSchema = new Schema({
  applicationId: Number,
  jobField: String,
  applicationDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Under review', 'Shortlisted', 'Rejected']
  },
  userName: String,
  userSurname: String,
  email: String,
  phone: String,
  education: String,
  cv: String,
  coverLetter: String,
  job_offer: {
    type: Schema.Types.ObjectId,
    ref: 'job_offer'
  },
  jobofferid:Number,
  title: String, 
  deadline: Date 
});

module.exports = mongoose.model("Application", applicationSchema);
