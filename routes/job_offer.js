const express = require("express");
const router = express.Router();
const userController = require("../Controllers/job-offerController");
const authMiddleware = require ('../midill/authMiddleware');
const job_offerModel = require("../models/job_offer");
const accessControl = require('../midill/accescontrol');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const Application = require('../models/application'); // Assurez-vous de spécifier le bon chemin vers votre modèle Application


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
// Route pour obtenir le nombre d'applications pour une offre spécifique
router.get('/applications/count/:jobOfferId', async (req, res) => {
  try {
    const jobOfferId = req.params.jobOfferId;
    const applicationCount = await Application.countDocuments({ job_offer: jobOfferId });
    res.json({ count: applicationCount });
  } catch (error) {
    console.error('Error counting applications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// [UPDATE]
router.put("/update/:id", async function (req, res) {
    try {
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


router.get("/search", authMiddleware, async function (req, res) {
  try {
      const { title, workplaceType, location, field } = req.query;
      let query = {};

      if (title) query.title = title;
      if (workplaceType) query.workplace_type = workplaceType;
      if (location) query.lieu = location;
      if (field) query.field = field;

      const jobOffers = await job_offerModel.find(query);
      res.json(jobOffers);
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
        user: 'manel.tarhouni@esprit.tn', // Votre adresse e-mail Outlook
        pass: '223Jft5504' // Votre mot de passe Outlook
      }
    });

    // Envoie le mail avec le contenu défini
    let info = await transporter.sendMail({
      from: '"admin" manel.tarhouni@esprit.tn',
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
