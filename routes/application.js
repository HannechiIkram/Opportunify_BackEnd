const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Set the destination folder for file uploads
const Application = require("../models/application");
const applicationController = require("../Controllers/applicationController");
const validate = require("../midill/validate");
const application = require("../models/application");
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

// [READ] 
router.get("/getall", applicationController.getall);

// [Add] 
router.post("/new", validate, applicationController.add);

// [UPDATE]
router.put("/update/:id", async function (req, res) {
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
router.delete("/delete/:id", async function (req, res) {
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
router.get("/search/date/:date", async function (req, res) {
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
        user: 'ahmedboudhina@live.com',
        pass: 'rim25457352'
    },
    tls: {
        rejectUnauthorized: false // Trust the self-signed certificate
    }
});



 // POST route to handle form submission for applying to a job offer
 router.post('/apply', upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'coverLetter', maxCount: 1 }]), async (req, res) => {
  try {
      const { userName, userSurname, email, phone, education } = req.body;
      const cv = req.files['cv'][0].path;
      const coverLetter = req.files['coverLetter'][0].path;
      const applicationDate = new Date();
      const status = "Under review";

      const newApplication = new Application({
          userName,
          userSurname,
          email,
          phone,
          education,
          cv,
          coverLetter,
          applicationDate,
          status
      });

      await newApplication.save();

      // Send email notification
      const mailOptions = {
          from: 'ahmedboudhina@live.com',
          to: req.body.email,
          subject: 'Application Submitted Successfully',
          text: 'Your application has been submitted successfully. We will review it shortly.'
      };

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
router.get('/get/:id', async (req, res) => {
    try {
        const applicationId = req.params.id;

        // Find the application by ID and populate the 'candidate' field with candidate details
        const foundApplication = await Application.findById(applicationId);

        if (!foundApplication) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // Extract relevant information from the application object
        const { userName, userSurname, email, phone, education, cv, coverLetter, applicationDate, status } = foundApplication;

        // Return application details along with candidate details
        res.json({
          applicationId,
            userName,
            userSurname,
            email,
            phone,
            education,
            cv,
            coverLetter,
            applicationDate,
            status,
        });
    } catch (error) {
        console.error('Error fetching application details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




module.exports = router;
