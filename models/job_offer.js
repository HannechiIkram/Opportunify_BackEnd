const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const job_offer = new Schema({
  jobofferid:Number,
  title: String,
  description: String,
  qualifications:String,
  responsibilities:String,
  lieu:String,
  langue:String,
  status:String,
  field:String,
  salary_informations:String,
 deadline:String


   // company: { type: mongo.Schema.Types.ObjectId, ref: 'Company' }, // Reference to the 'Company' model

  
});


//module.exports = mongo.model("job_offer", job_offer,"manel");
module.exports = mongoose.model("job_offer", job_offer);