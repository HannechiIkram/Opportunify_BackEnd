

const mongoose = require('mongoose');
const { Schema } = mongoose;
const interviewEventSchema = new mongoose.Schema({
  title: {
    type: String,
required:true
  },
  date: {
    type: String,
    required:true
  },
  duration: {
    type: String,
    required:true
  },
  location: {
    type: String,
    
  },
  starthour:{
    type: String,
    required:true
  },
  intervieweremail: {
    type: String,
  
  },
  eventMode:{
    type: String,
    required:true
    // "online" or "in-person
  },
  description:{
    type: String,
    required:true
  },
  profileJSid: {
     type: Schema.Types.ObjectId,
     ref: "ProfileJobSeeker" 
    },
    profileCid: {
      type: Schema.Types.ObjectId,
      ref: "ProfileCompany" 
     },

 
     CompanyName:{
    type: String,
  },
  /*
  jobseekerName:{
    type: String,
  },
*/
  joboffertitle:{
    type: String,
  },
});

const InterviewEvent = mongoose.model('InterviewEvent', interviewEventSchema);

module.exports = InterviewEvent;
