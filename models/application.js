const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const JobOffer = require("./job_offer"); 

const applicationSchema = new Schema({
  motivation: String,
  email:String,
  disponibilite:String,
  salaire : String,
  applicationDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Under review', 'Shortlisted', 'Rejected']
  },
 
  cv : String ,
  coverLetter : String,
job_seeker: { type: Schema.Types.ObjectId, ref: 'UserJobSeeker' },

  accepted: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },

  job_offer: {
    type: Schema.Types.ObjectId,
    ref: 'job_offer'
  },
});

module.exports = mongoose.model("Application", applicationSchema);
