const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const UserModel = require('../models/user');
const UserCompanyModel = require('../models/user-company');
const JobSeekerModel = require("../models/user-jobseeker");
const ProfileJobSeeker = require("../models/Profile_jobseeker");
const ProfileCompany = require("../models/Profile_company");
const { comparePassword, hashPassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");

 
  const generateMfaCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };
  const transporter1 = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
        user: 'opportunify@outlook.com',
        pass: 'Ahmed123.'
    },
    tls: {
        rejectUnauthorized: false 
    }
  });
  
  const sendMfaCodeByEmail = (email, code) => {
    const mailOptions = {
        from: '"Opportunify Login Center" opportunify@outlook.com',
        to: email,
        subject: 'MFA Code for Opportunify Login',
        text: `Your MFA code for Opportunify Login is: ${code}`
    };
  
    transporter1.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
  };
  router.post('/send-mfacode', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        
        if (!user.accepted) {
            return res.status(403).json({ error: "User is rejected and cannot log in" });
        }
        
        if (user.isBlocked) {
            return res.status(404).json({ error: "User is blocked" });
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        const mfaCodenew = generateMfaCode();
        sendMfaCodeByEmail(user.email, mfaCodenew);

        try {
            const updatedUser = await UserModel.findOneAndUpdate(
                { email: email },
                { mfaCode: mfaCodenew },
                { new: true }
            );
            const showcode = updatedUser.mfaCode;
            res.status(200).json({ message: "MFA code has been sent via email. Check your inbox for verification",
             mfaCode: showcode });
        } catch (error) {
            console.error('Error updating MFA code:', error);
            return res.status(500).json({ error: "Error updating MFA code" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/login-with-mfa', async (req, res) => {
    try {const { email, password, mfacode } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
 if (!user.accepted) {
  return res.status(403).json({ error: "User is rejected and cannot log in" });
}
if (    user.isBlocked ){return res.status(404).json({error:"User is blocked"})}

 ///////////////ekhdmmmmmmm ya code mfaaaa a33333
 const isMfaCodeValid = mfacode=== user.mfaCode; 

 if (!isMfaCodeValid) {
     return res.status(400).json({ error: "Invalid MFA code" });
 }
    let jobSeekerId = null;
    let profileId = null;
    let companyId = null;
    if (user.role === "job_seeker") {
      const jobSeeker = await JobSeekerModel.findOne({ email });
      jobSeekerId = jobSeeker ? jobSeeker._id : null;



 const existingProfile = await ProfileJobSeeker.findOne({ email });

 if (existingProfile) {
   profileId = existingProfile._id;
 } else {
      const profile = new ProfileJobSeeker({
        userId: jobSeekerId,
        name: jobSeeker.name,
        email: jobSeeker.email,
        password: user.password,
        lastname: jobSeeker.lastname,
        phone: jobSeeker.phone,
        address: jobSeeker.address,
        birthdate: jobSeeker.birthdate,
        role_jobseeker: jobSeeker.role_jobseeker,
        image: jobSeeker.image,
        technologies:jobSeeker.technologies,
      });

      const savedProfile = await profile.save();
      profileId = savedProfile._id;
    }}

    let company_profileId = null;

    if (user.role === "company") {
      const company = await UserCompanyModel.findOne({ email });

      if (!company) {
        return res.status(400).json({ error: "Company not found" });
      }

      const existingProfileCompany = await ProfileCompany.findOne({ email });

      if (existingProfileCompany) {
        company_profileId = existingProfileCompany._id;
      } else {

      const profileCompany = new ProfileCompany({
        userCid: company._id,
        name: company.name,
        email: company.email,
        password: company.password,
        matriculeFiscale:company.matriculeFiscale,
        description:company.description,
        address:company.address,
        phoneNumber:company.phoneNumber,
        socialMedia:company.socialMedia,
        domainOfActivity:company.domainOfActivity,

      });

      const savedProfileCompany = await profileCompany.save();
      company_profileId = savedProfileCompany._id;
    }}

    const match = await comparePassword(password, user.password);
    console.log("before");
    if (!match) {
      return res.status(400).json({ error: "Passwords don't match" });
    }
    console.log({ user });
    const accessToken = jwt.sign(
      {
        email: user.email,
        id: user._id,
        name: user.name,
        jobSeekerId,
        profileId,
        company_profileId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "180m" } 
    );

    const refreshToken = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, 
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
  
    res
      .status(200)
      .send({accessToken, user, jobSeekerId, profileId, company_profileId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
}
});
module.exports = router;



