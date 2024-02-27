const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
  userName: String,
  userSurname: String,
  email: String,
  phone: String,
  education: String,
  applications: [{ type: Schema.Types.ObjectId, ref: 'Application' }] 
});

module.exports = mongoose.model("Candidate", candidateSchema);
