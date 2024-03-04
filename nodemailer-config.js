// nodemailer-config.js
const nodemailer = require('nodemailer');

// Create a Nodemailer transporter using SMTP for Gmail
const transporter = nodemailer.createTransport({
 service:'gmail',
  auth: {
    user: 'hannechiikram94@gmail.com',  // Replace with your actual Gmail email address
    pass: 'tnyb upzw ntxq fvqa',     // Use the App Password generated for your app
  },
});
//////massaoudghassen9@gmail.com



module.exports = transporter;




