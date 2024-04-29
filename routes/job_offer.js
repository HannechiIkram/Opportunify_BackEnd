const express = require("express");
const router = express.Router();
const userController = require("../Controllers/job-offerController");
const authMiddleware = require ('../midill/authMiddleware');
const job_offerModel = require("../models/job_offer");
const accessControl = require('../midill/accescontrol');
const User = require('../models/user');
const nodemailer = require('nodemailer');

const isAdmin = accessControl(['admin']);
const isCompany = accessControl(['company']);
const isJobSeeker = accessControl(['job_seeker']);

//samarrrr Route to fetch job offers by user company ID
router.get('/company/joboffers', authMiddleware, async (req, res) => {
  try {
      const companyId = req.user.id;
      const jobOffers = await job_offerModel.find({ company: companyId });
      if (!jobOffers || jobOffers.length === 0) {
          return res.status(200).json({ message: 'No job offers found' });
      }
      res.status(200).json(jobOffers);
  } catch (error) {
      console.error('Error fetching job offers by user company ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



// [UPDATE]
router.put("/update/:id", async function (req, res) {
  try {
    const {
      title,
      description,
      qualifications,
      responsibilities,
      lieu,
      langue,
      workplace_type,
      field,
      salary_informations,
      deadline
    } = req.body;

    // Validate if all required fields are present in req.body
    if (!title || !description || !qualifications || !responsibilities || !lieu || !langue || !workplace_type || !field || !salary_informations || !deadline) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // Validate langue
    if (!/^[a-zA-Z]+$/.test(langue)) {
      return res.status(400).json({ error: "langue must contain only alphabetical characters" });
    }

      // Validate title length
      if (qualifications.length < 8) {
        return res.status(400).json({ error: "qualifications must be at least 5 characters long" });
      }
    // Validate title length
    if (title.length < 5) {
      return res.status(400).json({ error: "Title must be at least 5 characters long" });
    }

    // Validate title
    if (!/^[a-zA-Z]+$/.test(title)) {
      return res.status(400).json({ error: "Title must contain only alphabetical characters" });
    }

    // Validate responsibilities
    if (!/^[a-zA-Z]+$/.test(responsibilities)) {
      return res.status(400).json({ error: "Responsibilities must contain only alphabetical characters" });
    }

    // Validate job location (lieu) length
    if (lieu.length < 5) {
      return res.status(400).json({ error: "Job location must be at least 5 characters long" });
    }

    // Validate description length
    if (description.length < 10) {
      return res.status(400).json({ error: "Description must be at least 10 characters long" });
    }

    // Validate salary informations
    const salaryRegex = /^\d{3,}\s*(\$|DT|€)$/; // At least 3 digits followed by a symbol ($, DT, or €)
    if (!salaryRegex.test(salary_informations)) {
      return res.status(400).json({ error: "Salary information must contain at least 3 numbers followed by a currency symbol ($, DT, or €)" });
    }

    // Validate deadline
    if (!deadline) {
      return res.status(400).json({ error: "Deadline cannot be empty" });
    }

    const updatedjob_offer = await job_offerModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedjob_offer) {
      return res.status(404).json({ error: 'job_offer not found' });
    }
    res.status(200).json(updatedjob_offer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//  [DELETE] 
router.delete("/delete/:id", async function (req, res) {
    try {
      const deletedjoboffer = await job_offerModel.findOneAndDelete({ _id: req.params.id });
      if (!deletedjoboffer) {
        return res.status(404).json({ error: 'job_offer  not found' });
      }
      res.status(200).json({ message: 'job_offer deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
////samar
router.get("/getoffershomepage",userController.getoffershomepage);


    // Search based on the title
    router.get("/search/title/:title", authMiddleware, async function (req, res) {
      try {
          const title = req.params.title;
          const joboffers = await job_offerModel.find({ title });
          res.json(joboffers);
      } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  });
router.get("/getall",authMiddleware, userController.getall);

router.get("/get/:id", userController.getbyid);
//router.post("/add", userController.add);
router.post('/add',authMiddleware, userController.add);


// Route pour envoyer les détails de l'offre et un message personnalisé par e-mail
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { recipientEmail, message, offerDetails } = req.body; // Récupère les détails de l'offre envoyés depuis le client

    const emailContent = `
      ${message}  
      \n---\n  
      ${offerDetails}  
    `;

    // Configure le transporteur Nodemailer
    let transporter = nodemailer.createTransport({
      service: 'Outlook', // Utilisez le service Outlook
      auth: {
        user: 'ikram.hannechi@esprit.tn', // Votre adresse e-mail Outlook
        pass: 'Ih123456**' // Votre mot de passe Outlook
      }
    });

    // Envoie le mail avec le contenu défini
    let info = await transporter.sendMail({
      from: '"admin" ikram.hannechi@esprit.tn',
      to: recipientEmail,
      subject: 'Job Offer Details',
      text: emailContent // Utilisez le contenu de l'e-mail généré
    });

    console.log('Message envoyé: %s', info.messageId);

    res.status(200).json({ message: 'Email envoyé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
