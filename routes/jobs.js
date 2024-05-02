const express = require("express");
const router = express.Router();
const jobsController = require("../Controllers/jobsController");

// Route to create a new status
router.get("/", jobsController.getJobs);
module.exports = router;