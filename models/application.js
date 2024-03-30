const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  jobField: String,
  applicationDate: Date,
  status: {
    type: String,
    enum: ['Under review', 'Shortlisted', 'Rejected']
  },
 
  cv : String ,
  coverLetter : String,
job_seeker: { type: Schema.Types.ObjectId, ref: 'UserJobSeeker' },

  accepted: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false }
});

module.exports = mongoose.model("Application", applicationSchema);
