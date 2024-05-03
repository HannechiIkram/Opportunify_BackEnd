// applicationController.js

const express = require("express");
const Notifications = require ('../models/Notifications');




const Application = require("../models/application"); 
const nodemailer = require('nodemailer');


///samar
async function getall(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - User not logged in' });
    }

    const data = await Application.find();
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
// la recherche par id
async function getbyid(req, res) {
  try {
    const data = await Application.findById(req.params.id); // Corrected usage of Application model
    res.send(data);
  } catch (err) {
    res.send(err);
  }
}

// l'ajout d'une application
async function add(req, res, next) {
  try {
    const newApplication = new Application(req.body); 
    await newApplication.save();
    res.status(200).send({ message: 'Application added successfully' });
  } catch (err) {
    console.error(err); 
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
async function getById(req, res) {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).send({ error: 'Application not found' });
    }
    res.send(application);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}



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

// Fonction pour accepter une application
async function acceptApplication(req, res) {
  try {
    const { id } = req.params;
    
    // Récupérer les détails de l'application
    const application = await Application.findById(id).populate('job_offer'); // Populer les détails de l'offre d'emploi associée à l'application
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Récupérer l'e-mail associé à cette application
    const jobSeekerEmail = application.email;
    
    // Vérifier l'e-mail récupéré dans la console
    console.log('Email récupéré:', jobSeekerEmail);
// Récupérer le titre de l'offre d'emploi et le nom de l'entreprise associée
const jobOffer = application.job_offer;
const jobOfferTitle = application.job_offer.title;
// Populer les détails de la compagnie associée au job_offer
await jobOffer.populate('company');

// Maintenant, vous pouvez accéder aux détails de la compagnie à partir du job_offer
const companyName = jobOffer.company.name;
const companyImage = jobOffer.company.image;

    // Send email notification
    const mailOptions = {
      from: 'opportunify@outlook.com',
      to: jobSeekerEmail,
      subject: 'Application Accepted ',
      html: `
        <p>Your application for the job offer "${jobOfferTitle}" has been accepted.</p>
        <p>Company: ${companyName}</p>
      `
    };

    // Envoyer l'e-mail de notification
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email notification:', error);
      } else {
        console.log('Email notification sent:', info.response);
      }
    });

    // Créer une notification pour indiquer que l'application a été acceptée
    const notification = new Notifications({
      job_seeker: application.job_seeker,
      type: 'accepted',
      application: id,
      joboffertitle: jobOfferTitle,
      companyname: companyName,
      companyimage: companyImage
    });
    await notification.save();

    // Mettre à jour l'état de l'application
    const updatedApplication = await Application.findByIdAndUpdate(id, { accepted: true, rejected: false }, { new: true });

    res.status(200).json(updatedApplication);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Fonction pour rejeter une application
async function rejectApplication(req, res) {
  try {
    const { id } = req.params;
    
    // Récupérer les détails de l'application
    const application = await Application.findById(id).populate('job_offer'); // Populer les détails de l'offre d'emploi associée à l'application
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Récupérer l'e-mail associé à cette application
    const jobSeekerEmail = application.email;
    
    // Vérifier l'e-mail récupéré dans la console
    console.log('Email récupéré:', jobSeekerEmail);

    // Récupérer le titre de l'offre d'emploi et le nom de l'entreprise associée
    const jobOffer = application.job_offer;
    const jobOfferTitle = application.job_offer.title;
// Populer les détails de la compagnie associée au job_offer
await jobOffer.populate('company');

// Maintenant, vous pouvez accéder aux détails de la compagnie à partir du job_offer
const companyName = jobOffer.company.name;
const companyImage = jobOffer.company.image;
    // Vérifier les détails récupérés dans la console
    console.log('Job Offer Title:', jobOfferTitle);
    console.log('Company Name:', companyName);
    console.log('Company Image:', companyImage);

    // Send email notification
    const mailOptions = {
      from: 'opportunify@outlook.com',
      to: jobSeekerEmail,
      subject: 'Application Rejected ',
      html: `
        <p>Your application for the job "${jobOfferTitle}" has been rejected.</p>
        <p>Company: ${companyName}</p>
      `
    };

    // Envoyer l'e-mail de notification
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email notification:', error);
      } else {
        console.log('Email notification sent:', info.response);
      }
    });

    // Créer une notification pour indiquer que l'application a été rejetée
    const notification = new Notifications({
      job_seeker: application.job_seeker,
      type: 'rejected',
      application: id,
      joboffertitle: jobOfferTitle,
      companyname: companyName,
      companyimage: companyImage
    });
    await notification.save();


    // Mettre à jour l'état de l'application
    const updatedApplication = await Application.findByIdAndUpdate(id, { accepted: false, rejected: true }, { new: true });

    res.status(200).json(updatedApplication);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



module.exports = { getall, add , getbyid, getById , acceptApplication, rejectApplication };