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

module.exports = router;
