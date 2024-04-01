const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'ikramm/' }); // Set the destination folder for file uploads
const Application = require("../models/application");
const applicationController = require("../Controllers/applicationController");
const validate = require("../midill/validate");
const application = require("../models/application");
const nodemailer = require('nodemailer');
const UserJobSeeker = require('../models/user-jobseeker'); // Assurez-vous de corriger le chemin si nécessaire
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const JobOffer = require('../models/job_offer'); 




const authMiddleware = require ('../midill/authMiddleware');


// [READ] 
router.get("/getall",authMiddleware, applicationController.getall);

//get bel id 
// [Add] 
router.post("/new", validate, applicationController.add);

// [UPDATE]
router.put("/update/:id", authMiddleware, async function (req, res) {
  try {
    const updatedApplication = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.status(200).json(updatedApplication);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//  [DELETE] 
router.delete("/delete/:id",authMiddleware, async function (req, res) {
    try {
      const deletedApplication = await Application.findOneAndDelete({ _id: req.params.id });
      if (!deletedApplication) {
        return res.status(404).json({ error: 'Application not found' });
      }
      res.status(200).json({ message: 'Application deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  

  // Search based on the date of the application
router.get("/search/date/:date", authMiddleware, async function (req, res) {
    try {
      const date = new Date(req.params.date);
      const applications = await Application.find({ applicationDate: date });
      res.json(applications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Search based on the jobField
  router.get("/search/jobField/:jobField", async function (req, res) {
    try {
      const jobField = req.params.jobField;
      const applications = await Application.find({ jobField });
      res.json(applications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Search based on the status
  router.get("/search/status/:status", async function (req, res) {
    try {
      const status = req.params.status;
      const applications = await Application.find({ status });
      res.json(applications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'opportunify@outlook.com',
        pass: 'Ahmed123.'
    },
    tls: {
        rejectUnauthorized: false // Trust the self-signed certificate
    }
});
router.post('/apply', authMiddleware, upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'coverLetter', maxCount: 1 }]), async (req, res) => {
  try {
    const { email, offerId } = req.body; // Extract necessary fields from the request body
    const cvFile = req.files['cv'];
    if (!cvFile || !cvFile[0]) {
      return res.status(400).json({ error: 'CV file not provided' });
    }
    const cv = cvFile[0].path;
    
    const coverLetterFile = req.files['coverLetter'];
    if (!coverLetterFile || !coverLetterFile[0]) {
      return res.status(400).json({ error: 'Cover letter file not provided' });
    }
    const coverLetter = coverLetterFile[0].path; // Extract path of the cover letter file

    const applicationDate = new Date();
    const status = "Under review";

    // Check if the job seeker already exists
    let jobSeeker = await UserJobSeeker.findOne({ email });
    
    // If the job seeker doesn't exist, create a new one
    if (!jobSeeker) {
      jobSeeker = new UserJobSeeker({
        role_jobseeker: "student" // You might adjust this value based on your requirements
        // Add other fields as needed
      });
      await jobSeeker.save();
    }

    // Check if the offerId is valid
    if (!mongoose.Types.ObjectId.isValid(offerId)) {
      return res.status(400).json({ error: 'Invalid offer ID' });
    }

    // Find the job offer by its ID
    const jobOffer = await JobOffer.findById(offerId);
    if (!jobOffer) {
      return res.status(404).json({ error: 'Job offer not found' });
    }

    // Check if the application deadline has passed
    const currentDate = new Date();
    const deadline = new Date(jobOffer.deadline);
    if (currentDate > deadline) {
      return res.status(400).json({ error: 'Application deadline has passed' });
    }

    // Create a new application
    const newApplication = new Application({
      cv,
      coverLetter,
      applicationDate,
      status,
      job_offer: offerId,
      job_seeker: jobSeeker._id // Associate the application with the job seeker
    });

    // Save the new application
    await newApplication.save();

    // Send email notification
    const mailOptions = {
      from: 'opportunify@outlook.com',
      to: email,
      subject: 'Application Submitted Successfully',
      text: 'Your application has been submitted successfully. We will review it shortly.'
    };

    // Send email notification
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email notification:', error);
      } else {
        console.log('Email notification sent:', info.response);
      }
    });

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET route to retrieve application details by ID
router.get('/get/:id', authMiddleware,async (req, res) => {
  try {
    const applicationId = req.params.id;

    // Find the application by ID and populate the 'job_offer' field with job offer details
    const foundApplication = await Application.findById(applicationId).populate('job_offer');

    if (!foundApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }

   
    const {  cv, coverLetter, applicationDate, status } = foundApplication;


    res.json({
     
      cv,
      coverLetter,
      applicationDate,
      status,
      job_offer: foundApplication.job_offer 
    });
  } catch (error) {
    console.error('Error fetching application details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Ajouter les routes pour accepter et refuser une application
router.put("/accept/:id",authMiddleware, applicationController.acceptApplication);
router.put("/reject/:id",authMiddleware, applicationController.rejectApplication);


router.get('/:id', applicationController.getById);

// Middleware to parse JSON requests
router.use(bodyParser.json());


module.exports = router;
