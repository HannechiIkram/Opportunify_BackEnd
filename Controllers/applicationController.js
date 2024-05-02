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
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Récupérer l'e-mail associé à cette application
    const jobSeekerEmail = application.email;
    
    // Vérifier l'e-mail récupéré dans la console
    console.log('Email récupéré:', jobSeekerEmail);

  // Send email notification
  const mailOptions = {
    from: 'opportunify@outlook.com',
    to: jobSeekerEmail,
    subject: 'Application Accepted ',
    text: 'Your application has been accepted'
  };

    
       // Send email notification
       transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email notification:', error);
        } else {
          console.log('Email notification sent:', info.response);
        }
      });
  
      const notification = new Notifications({
        job_seeker: application.job_seeker,
        type: 'accepted',
        application: id,
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
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Récupérer l'e-mail associé à cette application
    const jobSeekerEmail = application.email;
    
    // Vérifier l'e-mail récupéré dans la console
    console.log('Email récupéré:', jobSeekerEmail);

  // Send email notification
  const mailOptions = {
    from: 'opportunify@outlook.com',
    to: jobSeekerEmail,
    subject: 'Application Rejected ',
    text: 'Your application has been rejected'
  };

    
       // Send email notification
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
          type: 'rejected',
          application: id,
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