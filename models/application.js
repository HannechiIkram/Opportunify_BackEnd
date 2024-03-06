const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  applicationId: Number,
  jobField: String,
  applicationDate: Date,
  status: {
    type: String,
    enum: ['Under review', 'Shortlisted', 'Rejected']
  },
  userName: String,
  userSurname: String,
  email: String,
  phone: String,
  education: String,
  cv : String ,
  coverLetter : String
});

module.exports = mongoose.model("Application", applicationSchema);
