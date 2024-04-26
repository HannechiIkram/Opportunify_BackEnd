const express = require("express");
const router = express.Router();
const userJobSeeker = require("../models/user-jobseeker");
const userCompany = require("../models/user-company");


const mongoose = require("mongoose");

// Route to fetch profile details by ID
router.get("/profile-detail/:id", async (req, res) => {
  let { id } = req.params;
  console.log("id", id);
  id =new  mongoose.Types.ObjectId(id);

  try {
    // Try to find the profile in the JobSeeker collection
    let profile = await userJobSeeker.findById(id);

    // If the profile is not found in the JobSeeker collection, try finding it in the Company collection
    if (!profile) {
      profile = await userCompany.findById(id);
    }

    // If the profile is found, return it
    if (profile) {
      res.json(profile);
    } else {
      // If the profile is not found in either collection, return a 404 Not Found error
      res.status(404).json({ error: "Profile not found" });
    }
  } catch (error) {
    console.error("Error fetching profile details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const extractUserIdFromCookies = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ error: "Access token not found" });
  }

  try {
    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    req.userId = userId; // Set userId in the request object
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid access token" });
  }
};


// POST /api/profile/follow/:profileId
router.post("/follow/:profileId", async (req, res) => {
  try {
    const { profileId } = req.params;
    let { userId } = req.body;
    
    let userIdObj = new mongoose.Types.ObjectId(userId);
    

    console.log("userId:", userIdObj);
    console.log("profileId:", profileId);

    // Check if userId is provided
   

  
    
    // Find the profile based on the provided profileId
    let currentUserProfile;
    const jobSeekerProfile = await userJobSeeker.findById(profileId);
    const companyProfile = await userCompany.findById(profileId);

    if (jobSeekerProfile) {
      // Update the job seeker profile
      await userJobSeeker.findByIdAndUpdate(profileId, {
        $addToSet: { followers: userIdObj },
      });
      // Find the current user's profile
      currentUserProfile = await userJobSeeker.findOne({
        userId: userIdObj,
      });
      console.log("currentUserProfile:", currentUserProfile);
    } else if (companyProfile) {
      // Update the company profile
      await userCompany.findByIdAndUpdate(profileId, {
        $addToSet: { followers: userIdObj },
      });
      // Find the current user's profile
      currentUserProfile = await userCompany.findOne({ userCid: userIdObj });
    } else {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Check if the current user's profile exists
    if (!currentUserProfile) {
      return res.status(404).json({ error: "Current user profile not found" });
    }

    // Update the following array of the current user's profile
    await currentUserProfile.updateOne({
      $addToSet: { following: profileId },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error following profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




module.exports = router;
