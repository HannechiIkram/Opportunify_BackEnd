const express = require("express");
const router = express.Router();
const ProfileJobSeeker = require("../models/Profile_jobseeker"); // Corrected import statement
const ProfileCompany = require("../models/Profile_company"); // Corrected import statement

router.get("/users", async (req, res) => {
  const { query } = req.query;

  try {
    // Search job seekers by name or last name
    const jobSeekerResults = await ProfileJobSeeker.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { lastname: { $regex: query, $options: "i" } },
      ],
    });

    // Search companies by name
    const companyResults = await ProfileCompany.find({
      name: { $regex: query, $options: "i" },
    });

    // Combine the search results and return them
    const combinedResults = [...jobSeekerResults, ...companyResults];
    res.json(combinedResults);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/profile/:id", async (req, res) => {
  try {
    const profile = await ProfileJobSeeker.findById(req.params.id);
    if (!profile) {
      profile = await ProfileCompany.findById(req.params.id);
    }
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const profileJobSeeker = await ProfileJobSeeker.find();
    const profileCompany = await ProfileCompany.find(); // Changed 'ProfileCompany' to 'profileCompany'

    if (profileJobSeeker.length === 0 && profileCompany.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Combine both arrays into one
    const allProfiles = [...profileJobSeeker, ...profileCompany];
    console.log(allProfiles);
    res.status(200).json(allProfiles);
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
