const mongoose = require("mongoose");
const { Schema } = mongoose;

const status = new Schema(
  {
    userProfileId: {
      type: Schema.Types.ObjectId,
      ref: "ProfileJobSeeker",
    },
    companyProfileId: {
      type: Schema.Types.ObjectId,
      ref: "ProfileCompany",
    },
    content: String,
    tags: [String],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProfileJobSeeker",
      },
    ],
    comments: [
      new Schema(
        {
          profile: { type: Schema.Types.ObjectId, ref: "ProfileJobSeeker" },
          commentContent: String,
        },
        { timestamps: true }
      ),
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Status", status);
