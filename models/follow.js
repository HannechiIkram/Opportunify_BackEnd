const mongoose = require("mongoose");
const { Schema } = mongoose;

const followschema = new Schema({
  userProfileId: {
    type: Schema.Types.ObjectId,
    ref: "ProfileJobSeeker", // Reference to ProfileJobSeeker model
  },
  companyProfileId: {
    type: Schema.Types.ObjectId,
    ref: "ProfileCompany", // Reference to ProfileCompany model
  },
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "ProfileJobSeeker", // Reference to ProfileJobSeeker model
    },
    {
      type: Schema.Types.ObjectId,
      ref: "ProfileCompany", // Reference to ProfileCompany model
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "ProfileJobSeeker", // Reference to ProfileJobSeeker model
    },
    {
      type: Schema.Types.ObjectId,
      ref: "ProfileCompany", // Reference to ProfileCompany model
    },
  ],
});



module.exports = mongoose.model("Follow", followschema);
