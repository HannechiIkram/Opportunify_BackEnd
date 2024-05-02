const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new mongoose.Schema({
  job_seeker: { type: Schema.Types.ObjectId, ref: "UserJobSeeker" },
  type: String,
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  job_offer: { type: Schema.Types.ObjectId, ref: 'JobOffer' },
});


module.exports = mongoose.model("Notification", notificationSchema);