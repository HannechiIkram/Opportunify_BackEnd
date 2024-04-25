
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

// saamrrr applications ljob offer mou3ayen
router.get('/applicationperoffer/:offerId', authMiddleware,async (req, res) => {
  const offerId = req.params.offerId;
  try {
      const applications = await Application.find({ job_offer: offerId }).populate('job_offer').exec();
      if (!applications) {
          return res.status(201).json({ message: 'Applications not found' });
      }
      res.send(applications);
  } catch (error) {
      console.error('Error fetching application:', error);
      res.status(500).json({ message: 'An error occurred while fetching the application' });
  }
});

////applications mtaa el user eli connecté
router.get('/application/user', authMiddleware, async (req, res) => {
  try {
      const userId = req.user.id;

      const applications = await Application.find({ job_seeker: userId });

      if (!applications || applications.length === 0) {
          return res.status(200).json({ message: 'No applications found for the user' });
      }
      res.status(200).json(applications);
  } catch (error) {
      console.error('Error fetching applications by user ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// [READ] 
router.get("/getall",authMiddleware, applicationController.getall);

//get bel id 
// [Add] 
router.post("/new", validate, applicationController.add);

// [UPDATE]
router.put("/update/:id", authMiddleware, async function (req, res) {
  try {
    console.log("Received PUT request to update application:", req.body); // Affiche les données reçues dans la requête PUT
    const applicationBeforeUpdate = await Application.findById(req.params.id);
    if (!applicationBeforeUpdate) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Compare les données avant et après la mise à jour pour afficher les changements
    const changes = {};
    for (const key in req.body) {
      if (applicationBeforeUpdate[key] !== req.body[key]) {
        changes[key] = {
          oldValue: applicationBeforeUpdate[key],
          newValue: req.body[key]
        };
      }
    }

    const updatedApplication = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log("Updated application:", updatedApplication); // Affiche les données mises à jour

    if (Object.keys(changes).length > 0) {
      console.log("Changes:", changes); // Affiche les changements effectués
    } else {
      console.log("No changes detected.");
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
router.get("/search/date/:date",authMiddleware, async function (req, res) {
    try {
      const date = new Date(req.params.date);
      const applications = await Application.find({ applicationDate: date });
      res.json(applications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
  // Search based on the status
  router.get("/search/status/:status",authMiddleware ,async function (req, res) {
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
    const userId = req.user.id;
    const { offerId ,motivation,disponibilite, salaire} = req.body; 
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

    const applicationDate = new Date().toISOString().split('T')[0];

    const status = "Under review";
    
    // Récupérer l'e-mail du job seeker connecté depuis les données du token
    const email = req.user.email;

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
      email,
      motivation,
      disponibilite,
      salaire,
      job_offer: offerId,
      job_seeker: userId  // Associate the application with the job seeker
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

   
    const {  cv, coverLetter, applicationDate, status, motivation , salaire , disponibilite, email } = foundApplication;


    res.json({
     
      cv,
      coverLetter,
      applicationDate,
      status,
      email,
      salaire ,
      disponibilite,
      motivation,
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



////////////////////////////////////////////////////////////////////////////////////
const fs = require('fs');

const app = express();

// ... other routes

app.get('/download-cv/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const cvPath = path.join(__dirname, 'ikramm', application.cv);

    if (!fs.existsSync(cvPath)) {
      return res.status(404).json({ message: 'CV file not found' });
    }

    res.setHeader('Content-Type', 'application/pdf'); // Adjust for relevant content type
    res.setHeader('Content-Disposition', `attachment; filename="${application.cv}"`); // Allow customization

    const cvStream = fs.createReadStream(cvPath);
    cvStream.pipe(res);
  } catch (error) {
    console.error('Error downloading CV:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/download-cover-letter/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const coverLetterPath = path.join(__dirname, 'ikramm', application.coverLetter);

    if (!fs.existsSync(coverLetterPath)) {
      return res.status(404).json({ message: 'Cover letter file not found' });
    }

    res.setHeader('Content-Type', 'application/pdf'); // Adjust for relevant content type
    res.setHeader('Content-Disposition', `attachment; filename="${application.coverLetter}"`); // Allow customization

    const coverLetterStream = fs.createReadStream(coverLetterPath);
    coverLetterStream.pipe(res);
  } catch (error) {
    console.error('Error downloading cover letter:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/applications/search/joboffertitle',authMiddleware, async (req, res) => {
  try {
    const { jobOfferTitle } = req.query;

    // Recherche dans la base de données en fonction du titre de l'offre d'emploi
    const applications = await Application.find()
      .populate({
        path: 'job_offer',
        match: { title: { $regex: jobOfferTitle, $options: 'i' } }
      })
      .exec();

    // Filtrer les applications pour ne renvoyer que celles avec une offre d'emploi correspondante
    const filteredApplications = applications.filter(application => application.job_offer !== null);

    res.json(filteredApplications);
  } catch (error) {
    console.error('Error searching for applications by job offer title:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Middleware to parse JSON requests
router.use(bodyParser.json());


module.exports = router;
