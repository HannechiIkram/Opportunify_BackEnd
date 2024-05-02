const express = require("express");
const router = express.Router();
const userJobSeeker = require("../models/Profile_jobseeker");
const userCompany = require("../models/Profile_company");
const Follow = require("../models/follow");
const authMiddleware = require("../midill/authMiddleware");
const mongoose = require("mongoose");

// Route to fetch profile details by ID
router.get("/profile-detail/:id", async (req, res) => {
  const id = req.params.id;
  const objectId = new mongoose.Types.ObjectId(id);

  try {
    // Try to find the profile in the JobSeeker collection
    let profile = await userJobSeeker.findOne({ _id: objectId });

    // If the profile is not found in the JobSeeker collection, try finding it in the Company collection
    if (!profile) {
      profile = await userCompany.findOne({ _id: objectId });
    }

    // If the profile is found, update the followers field with the current user's information
    if (profile) {
      // Assuming req.userId is set by the authentication middleware
      profile.followers = [{ type: "ProfileJobSeeker", ref: req.userId }];
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

router.post("/follow/:id", async (req, res) => {
  try {
    let { userProfileId, companyProfileId } = req.body;
    const profileId = req.params.id; // Assuming the id in the route parameter is the profileId to follow
   console.log("profileId:", profileId);
   console.log("userProfileId:", userProfileId);
    console.log("companyProfileId:", companyProfileId);
    let foundFollow = await Follow.findOne({
      $or: [{ userProfileId: profileId }, { companyProfileId: profileId }],
    });

    if (!foundFollow) {
      // Create a new follow document if not found
      foundFollow = new Follow({
        userProfileId: userProfileId ? userProfileId : null,
        companyProfileId: companyProfileId ? companyProfileId : null,
        followers: [req.userId], // Add the current user as a follower
        following: [profileId], // Add the profile being followed
      });
    } else {
      // Update existing follow document
      if (!foundFollow.followers.includes(req.userId)) {
        foundFollow.followers.push(req.userId); // Add the current user as a follower if not already following
      }
      if (!foundFollow.following.includes(profileId)) {
        foundFollow.following.push(profileId); // Add the profile being followed if not already following
      }
    }

    const updatedFollow = await foundFollow.save();
    // Optionally, you can return the updated follow document
    res
      .status(200)
      .json({ message: "Follow updated successfully", follow: updatedFollow });
  } catch (error) {
    console.error("Error updating follow:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




// Route to retrieve followers for a profile
router.get("/followers/:id", async (req, res) => {
  try {
    const followers = await Follow.find({ following: req.params.id });
    res.status(200).json(followers);
  } catch (error) {
    console.error("Error retrieving followers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to retrieve following for a profile
router.get('/following/:id', async (req, res) => {
  try {
    const following = await Follow.find({ followers: req.params.id });
    res.status(200).json(following);
  } catch (error) {
    console.error('Error retrieving following:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// Route to unfollow a profile
router.delete("/unfollow/:id", authMiddleware, async (req, res) => {
  try {
    await Follow.findOneAndDelete({
      userProfileId: req.user.id,
      companyProfileId: req.params.id,
    });
    res.status(200).json({ message: "Profile unfollowed successfully" });
  } catch (error) {
    console.error("Error unfollowing profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});















/*
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
    
     userIdObj = new mongoose.Types.ObjectId(userId);
    

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
*/




module.exports = router;
