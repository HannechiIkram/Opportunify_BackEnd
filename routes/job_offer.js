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
router.post('/add', authMiddleware, userController.add);




router.post('/send',authMiddleware, async (req, res) => {
  try {
    const { recipientEmail, message } = req.body;

    // Create a nodemailer transporter configured for Outlook SMTP
    let transporter = nodemailer.createTransport({
      service: 'Outlook', // Use Outlook service
      auth: {
        user: 'ikram.hannechi@esprit.tn', // Your Outlook email
        pass: 'Ih123456**' // Your Outlook password
      }
    });

    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"admin" ikram.hannechi@esprit.tn',
      to: recipientEmail,
      subject: 'Job Offer Details',
      text: message
    });

    console.log('Message sent: %s', info.messageId);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
