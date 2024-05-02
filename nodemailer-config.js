// nodemailer-config.js
const nodemailer = require('nodemailer');

// Create a Nodemailer transporter using SMTP for Microsoft Outlook/Office 365
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',  // Update the host for Outlook/Office 365
  port: 587,  // Port for Outlook/Office 365
  secure: false,  // Set to true if using port 465, false for other ports
  auth: {
    user: 'manel.tarhouni@esprit.tn',  // Replace with your Outlook/Office 365 email address
    pass: '223Jft5504',  // Use your Outlook/Office 365 email password
  }, 
});

module.exports = transporter;
