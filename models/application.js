const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const yup = require("yup");

const applicationSchema = new Schema({
  motivation: {
    type: String,
    required: true,
  },
  email: String,
  disponibilite: String,
  salaire: String,
  applicationDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Under review", "Shortlisted", "Rejected"],
    required: true,
  },
  cv: String,
  coverLetter: String,
  job_seeker: { type: Schema.Types.ObjectId, ref: "UserJobSeeker" },
  accepted: { type: Boolean, default: false },
  rejected: { type: Boolean, default: false },
  job_offer: { type: Schema.Types.ObjectId, ref: "job_offer" },
});

// Définir le schéma de validation pour la longueur minimale de la motivation
const motivationSchema = yup
  .string()
  .required()
  .min(200, "Motivation should be at least 200 characters long");


module.exports = mongoose.model("Application", applicationSchema);
