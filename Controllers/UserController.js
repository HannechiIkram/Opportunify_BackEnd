const UserModel = require('../models/user');
const mongoose = require("mongoose"); // Importez Mongoose ici
const UserCompanyModel = require('../models/user-company');
const User = require('../models/user');
const JobSeekerModel = require("../models/user-jobseeker");
const ProfileJobSeeker = require("../models/Profile_jobseeker");
const ProfileCompany = require("../models/Profile_company");
const { comparePassword, hashPassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const passport = require("passport");
const InstagramStrategy = require("passport-instagram").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const UserJobSeekerModel = require('../models/user-jobseeker'); 

const registerUser = async (req, res) => {
  try {
    const { name,email, password,lastname, role ,description,phone,phoneNumber,socialMedia,address,imageUrl } = req.body;

    // Validate input
    if (!email || !password || !role||!name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already taken' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role, 
      image: imageUrl,// Add image URL to user data

      address,
      phone,
      phoneNumber,
      socialMedia,
      lastname,
      description
    });

    const newCompanyUser = await UserCompanyModel.create({
      name,
      email,
      password: hashedPassword,
      role: 'company'
  
    });
    
// Create the UserJobSeeker f table mtaa jobseeker
const newUserJobSeeker = await UserJobSeekerModel.create({
  name,
  email,
  password: hashedPassword,
 
  role: 'job_seeker',
 

});

    return res.status(201).json({msg:"user added successfully",newUser,newUserJobSeeker,newUserJobSeeker });
    
    // Return response

    return res.status(201).json({
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
      newCompanyUser
    });
  } catch (error) {
    console.error('Error during user registration:', error);}
  }



// Import the transporter configuration (make sure the path is correct)
const transporter = require('../nodemailer-config');
;const registerUserCompany = async (req, res) => {
  try {
    const { name, email, password, matriculeFiscale, description, socialMedia, address, phoneNumber, domainOfActivity, image } = req.body;

    // Vérification de la présence des champs obligatoires
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Validation de la longueur du mot de passe
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Vérification si l'email est déjà pris
    const exist = await UserCompanyModel.findOne({ email });
    if (exist) {
      return res.status(400).json({ error: 'Email is already taken' });
    }

    // Validation du numéro de téléphone
    if (!/^\d{1,12}$/.test(phoneNumber)) {
      return res.status(400).json({ error: 'Phone number should contain only digits and not exceed 12 characters' });
    }

    // Validation du domaine d'activité
    if (!/^[a-zA-Z]+$/.test(domainOfActivity)) {
      return res.status(400).json({ error: 'Domain of activity should contain only letters' });
    }

    // Validation des liens des réseaux sociaux
    const socialMediaValidation = validateSocialMediaLinks(socialMedia);
    if (socialMediaValidation.error) {
      return res.status(400).json({ error: socialMediaValidation.error });
    }

   // Validation de la description
if (!/^[a-zA-Z\s\n]+$/.test(description)) {
  return res.status(400).json({ error: 'Description should contain only letters, spaces, and paragraphs' });
}
// Check if user already existstry {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email is already taken' });
  }
  
  const imageUrl = req.file ? req.file.path : ''; // If req.file is undefined, set imageUrl to an empty string

  const hashedPassword = await hashPassword(password);

  const newCompanyUser = await UserCompanyModel.create({
    name,
    email,
    password: hashedPassword,
    matriculeFiscale,
    description,
    socialMedia,
    address,
    phoneNumber,
    domainOfActivity,
    image: imageUrl // Add image URL to user data

  });

  const newUser = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    role: 'company',
    matriculeFiscale,
    description,
    socialMedia,
    address,
    phoneNumber,
    domainOfActivity,
    image: imageUrl // Add image URL to user data

  });

  return res.status(201).json({ msg: "User added successfully",  newUser,newCompanyUser });
} catch (error) {
  console.error(error);
  return res.status(500).json({ error: 'Internal Server Error' });
}
}
// Function to validate social media links
const validateSocialMediaLinks = (socialMedia) => {
  for (const key in socialMedia) {
    const link = socialMedia[key];
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

    if (!urlRegex.test(link)) {
      return { error: `${key} should be a valid URL` };
    }
  }
///
  return { valid: true };
};

///
// Set up rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per windowMs
  message: 'Too many login attempts, please try again later.',
});

// Set up slowing down of requests after 3 failed attempts within the windowMs
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 3, // After 3 requests within windowMs, delay subsequent requests
  delayMs: () => 180000, // Delay subsequent requests by 3 minutes
});


///// login with Protection Against Brute Force Attacks

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user based on the provided email
    const user = await UserModel.findOne({ email });
    // Check if the user exists
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
 // Vérifier si l'utilisateur est accepté
 if (!user.accepted) {
  return res.status(403).json({ error: "User is rejected and cannot log in" });
}
if (    user.isBlocked ){return res.status(404).json({error:"User is blocked"})}

// Vérifier le mot de passe (en supposant que vous avez un système de mots de passe hachés)

    // Initialize jobSeekerId and profileId
    let jobSeekerId = null;
    let profileId = null;
    let companyId = null;
    // Check if the user is a job seeker
    if (user.role === "job_seeker") {
      // Retrieve the ID of the job seeker using JobSeekerModel
      const jobSeeker = await JobSeekerModel.findOne({ email });
      jobSeekerId = jobSeeker ? jobSeeker._id : null;



 // Check if a profile already exists with the same email
 const existingProfile = await ProfileJobSeeker.findOne({ email });

 if (existingProfile) {
   // If a profile exists, use its _id  
   profileId = existingProfile._id;
 } else {
      // Create a profile for the job seeker
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

      // Save the profile to the database
      const savedProfile = await profile.save();
      profileId = savedProfile._id;
    }}

    // Check if the user is a company
    let company_profileId = null;

    // Check if the user is a company
    if (user.role === "company") {
      // Retrieve the company with the same email
      const company = await UserCompanyModel.findOne({ email });

      // Check if a company with the provided email exists
      if (!company) {
        return res.status(400).json({ error: "Company not found" });
      }

      const existingProfileCompany = await ProfileCompany.findOne({ email });

      if (existingProfileCompany) {
        // If a profile exists, use its _id  
        company_profileId = existingProfileCompany._id;
      } else {

      // Create a profile for the company
      const profileCompany = new ProfileCompany({
        userCid: company._id, // Assuming the company model has '_id' as the primary key
        name: company.name,
        email: company.email,
        password: company.password,
        matriculeFiscale:company.matriculeFiscale,
        description:company.description,
        address:company.address,
        phoneNumber:company.phoneNumber,
        socialMedia:company.socialMedia,
        domainOfActivity:company.domainOfActivity,

        // Add other fields from the company model as needed
      });

      // Save the profile to the database
      const savedProfileCompany = await profileCompany.save();
      company_profileId = savedProfileCompany._id;
    }}

    // Compare the provided password with the stored hashed password
    const match = await comparePassword(password, user.password);
    console.log("before");
    // Check if the passwords match
    if (!match) {
      return res.status(400).json({ error: "Passwords don't match" });
    }
    console.log({ user });
    // Generate access token
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
      { expiresIn: "180m" } // Adjust the expiration time as needed
      // Adjust the expiration time as needed
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" } // Adjust the expiration time as needed
    );

    //res.cookie('jwt', refreshToken, {
    /*   // Set both tokens as HTTP-only cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true, // other cookie options as needed
    });
*/
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // other cookie options as needed
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return the access token, user data, jobSeekerId, and profileId in the response
    res
      .status(200)
      .send({ accessToken, user, jobSeekerId, profileId, company_profileId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}; 


/*
const getAllProfileCompanies = async (req, res) => {
  try {
    // Fetch all profile companies from the database
    const profileCompanies = await ProfileCompany.find();

    // Send the profile companies in the response
    res.status(200).json({ profileCompanies });
  } catch (error) {
    console.error('Error fetching all profile companies:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};   */
/////////////////////////////////////////////////////////////////////////////////
const getProfileJobSeekerById = async (req, res) => {
  try {
    const profileId = req.params.profileId; // Assuming the profile ID is passed as a parameter

    // Find the profile by ID
    const profile = await ProfileJobSeeker.findById(profileId);

    // Check if the profile exists
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Return the profile data
    res.status(200).json({ profile });
  } catch (error) {
    console.error("Error fetching profile job seeker:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
////////////////////////////////////////////////////////////////////////////////

// Refresh token
const refreshAccessToken = (req, res) => {
  try {
    // Get the refresh token from the HTTP-only cookie
    const refreshToken = req.cookies.refreshToken;
    console.log("Received Refresh Token:", refreshToken);

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log("Decoded Refresh Token:", decoded);

    // Generate a new access token
    const accessToken = jwt.sign(
      { email: decoded.email, id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Adjust the expiration time as needed
    );

    // Return the new access token
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Utilisateur non trouvé" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpires = Date.now() + 3600000; // 1 hour expiration

    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;

    await user.save();

    const resetLink = `http://votre_application.com/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: "ikram.hannechi@esprit.tn",
      to: email,
      subject: "Réinitialisation de mot de passe",
      text: `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Erreur d'envoi de l'e-mail :", error);
        return res.status(500).json({ error: "Erreur interne du serveur" });
      }
      console.log("E-mail envoyé :", info.response);
      res.status(200).json({
        message:
          "Lien de réinitialisation du mot de passe envoyé à votre e-mail",
      });
    });
  } catch (error) {
    console.error("Erreur de mot de passe oublié :", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    const user = await UserModel.findOne({
      resetToken,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.error("Invalid or expired reset token:", resetToken);
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Configure Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: "443118344822988",
      clientSecret: "9c74042f8ac329b9b7234ed887abe66c",
      callbackURL: "http://localhost:5173/auth/facebook/callback", // Adjust the callback URL as needed
    },
    (accessToken, refreshToken, profile, done) => {
      // Handle user data returned by Facebook and save it in your database
      return done(null, profile);
    }
  )
);

/*
// Configure Instagram Strategy
passport.use(new InstagramStrategy({
  clientID: 'YOUR_INSTAGRAM_CLIENT_ID',
  clientSecret: 'YOUR_INSTAGRAM_CLIENT_SECRET',
  callbackURL: 'http://localhost:5173/auth/instagram/callback' // Adjust the callback URL as needed
}, (accessToken, refreshToken, profile, done) => {
  // Handle user data returned by Instagram and save it in your database
  return done(null, profile);
}));

// Configure Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: 'YOUR_FACEBOOK_APP_ID',
  clientSecret: 'YOUR_FACEBOOK_APP_SECRET',
  callbackURL: 'http://localhost:5173/auth/facebook/callback' // Adjust the callback URL as needed
}, (accessToken, refreshToken, profile, done) => {
  // Handle user data returned by Facebook and save it in your database
  return done(null, profile);
}));

// Configure Google Strategy
passport.use(new GoogleStrategy({
  clientID: 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  callbackURL: 'http://localhost:5173/auth/google/callback' // Adjust the callback URL as needed
}, (accessToken, refreshToken, profile, done) => {
  // Handle user data returned by Google and save it in your database
  return done(null, profile);
}));

// Configure LinkedIn Strategy
passport.use(new LinkedInStrategy({
  clientID: 'YOUR_LINKEDIN_CLIENT_ID',
  clientSecret: 'YOUR_LINKEDIN_CLIENT_SECRET',
  callbackURL: 'http://localhost:5173/auth/linkedin/callback' // Adjust the callback URL as needed
}, (accessToken, refreshToken, profile, done) => {
  // Handle user data returned by LinkedIn and save it in your database
  return done(null, profile);
}));
*/

/*
async function getUsers(req, res) {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving users');
  }
}
*/

const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving users");
  }
};

const getUserCompany = async (req, res) => {
  try {
    const users = await UserCompanyModel.find();
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving users");
  }
};

///register company
/*
const createUserCompany = async (req, res) => {
  try {
    const { name, email, password, address, phoneNumber, domainOfActivity } = req.body;

    // Vérification de la présence des champs obligatoires
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ error: 'Name, email, password, and phone number are required' });
    }

    // Création d'un nouveau modèle d'utilisateur de type "company"
    const newUserCompany = await UserCompanyModel.create({
      name,
      email,
      password,
      address,
      phoneNumber,
      domainOfActivity,
    });

    // Retourner la réponse avec le nouvel utilisateur créé
    return res.status(201).json({ newUserCompany });
  } catch (error) {
    console.error('Error creating user company:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

*/ // userController.js

const getUserCompanyProfile = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you pass the user ID as a URL parameter

    // Retrieve company profile from UserCompanyModel using the user ID
    const userCompany = await UserCompanyModel.findOne({ userId });

    if (!userCompany) {
      return res.status(404).json({ error: "Company profile not found" });
    }

    // Return the company profile data
    res.status(200).json({ userCompany });
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//

const getUserByIdd = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you pass the user ID as a URL parameter

    // Retrieve user from UserModel using the user ID
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user data
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllJobSeekerProfiles = async (req, res) => {
  try {
    // Assuming you have a model named JobSeekerProfile
    const profiles = await ProfileJobSeeker.find();
    res.send(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving job seeker profiles");
  }
};

const getProfileJobSeekerByUserId = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming the userId is passed as a parameter

    // Find the profile by userId
    const profile = await ProfileJobSeeker.findOne({ userId });

    // Check if the profile exists
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Return the profile data
    res.status(200).json({ profile });
  } catch (error) {
    console.error("Error fetching profile job seeker by userId:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProfileCompanyById = async (req, res) => {
  try {
    const profileId = req.params.profileId; // Assuming the profileId is passed as a parameter

    // Find the profile by profileId
    const profile = await ProfileCompany.findOne({ _id: profileId });

    // Check if the profile exists
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Return the profile data
    res.status(200).json({ profile });
  } catch (error) {
    console.error("Error fetching profile company by ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/*
const updateProfileJobSeekerById = async (profileId, updates) => {
  try {
    // Find the profile job seeker by ID
    const profile = await ProfileJobSeeker.findById(profileId);

    // Check if the profile exists
    if (!profile) {
      throw new Error('Profile job seeker not found');
    }

    // Check if updates include name, password, or image
    if (updates.name || updates.password || updates.image) {
      // Update corresponding user with matching email
      await UserModel.findOneAndUpdate({ email: profile.email }, { $set: updates });
    }

    // Check if updates include name, lastname, password, birthdate, address, image, phone, or role_jobseeker
    if (updates.name || updates.lastname || updates.password || updates.birthdate || updates.address || updates.image || updates.phone || updates.role_jobseeker) {
      // Update corresponding job seeker with matching email
      await JobSeekerModel.findOneAndUpdate({ email: profile.email }, { $set: updates });
    }

    // Exclude _id field from updates
    delete updates._id;

    // Update profile job seeker
    const updatedProfileJobSeeker = await ProfileJobSeeker.findByIdAndUpdate(profileId, { $set: updates }, { new: true });

    return updatedProfileJobSeeker;
  } catch (error) {
    throw error;
  }
};*/
const updateProfileJobSeekerById = async (profileId, updates) => {
  try {
    // Find the profile job seeker by ID
    const profile = await ProfileJobSeeker.findById(profileId);

    // Check if the profile exists
    if (!profile) {
      throw new Error("Profile job seeker not found");
    }
      // Validate updates
      const errors = {};

      // Validate name
      if (updates.name && updates.name.trim() === "") {
        errors.name = "Name cannot be empty";
      }
     // Validate lastname
     if (updates.address && updates.address.trim() === "") {
      errors.address = "address cannot be empty";
    }

      // Validate lastname
      if (updates.lastname && updates.lastname.trim() === "") {
        errors.lastname = "Lastname cannot be empty";
      }
          
        // Check if there are validation errors
    if (Object.keys(errors).length > 0) {
      throw new Error(JSON.stringify(errors));
    }

    const updatedProfileJobSeeker = await ProfileJobSeeker.findByIdAndUpdate(
      profileId,
      { $set: updates },
      { new: true }
    );
    delete updates._id;

    // Check if updates include name, password, or image
    if (updates.name || updates.password || updates.image) {
      // Update corresponding user with matching email
      await UserModel.findOneAndUpdate(
        { email: profile.email },
        { $set: updates }
      );
    }

    // Check if updates include name, lastname, password, birthdate, address, image, phone, or role_jobseeker
    if (
      updates.name ||
      updates.lastname ||
      updates.password ||
      updates.birthdate ||
      updates.address ||
      updates.image ||
      updates.phone ||
      updates.role_jobseeker
    ) {
      // Update corresponding job seeker with matching email
      await JobSeekerModel.findOneAndUpdate(
        { email: profile.email },
        { $set: updates }
      );
    }
    delete updates._id;

    // Exclude _id field from updates

    // Update profile job seeker

    return updatedProfileJobSeeker;
  } catch (error) {
    throw error;
  }
};
const updateProfileCompany = async (profileId, updates) => {
  try {
    // Validation
    const errors = {};

    // Validate name
    if ('name' in updates && !updates.name.trim()) {
      errors.name = 'Name cannot be empty';
    }

    // Validate address
    if ('address' in updates && !updates.address.trim()) {
      errors.address = 'Address cannot be empty';
    }

    // Validate phoneNumber
    if ('phoneNumber' in updates) {
      if (!updates.phoneNumber.trim()) {
        errors.phoneNumber = 'Phone number cannot be empty';
      } else if (!/^\d+$/.test(updates.phoneNumber.trim())) {
        errors.phoneNumber = 'Phone number must contain only digits';
      } else if (updates.phoneNumber.trim().length > 11) {
        errors.phoneNumber = 'Phone number cannot exceed 11 digits';
      }
    }

    // Validate domainOfActivity
    if ('domainOfActivity' in updates && !updates.domainOfActivity.trim()) {
      errors.domainOfActivity = 'Domain of activity cannot be empty';
    }

    // Validate matriculeFiscale
    if ('matriculeFiscale' in updates && !updates.matriculeFiscale.trim()) {
      errors.matriculeFiscale = 'Matricule fiscale cannot be empty';
    }

    // Validate description
    if ('description' in updates && !updates.description.trim()) {
      errors.description = 'Description cannot be empty';
    }

    // Validate facebook
    // Add validation for other social media fields if needed

    // If there are validation errors, throw an error
    if (Object.keys(errors).length > 0) {
      throw errors;
    }

    // Update the profile of the company
    const updatedProfileCompany = await ProfileCompany.findByIdAndUpdate(
      profileId,
      { $set: updates },
      { new: true }
    );

    // Delete the _id field from updates
    delete updates._id;

    if (updates.name || updates.password) {
      // Update corresponding user with matching email
      await User.findOneAndUpdate(
        { email: updatedProfileCompany.email },
        { $set: updates }
      );
    }

    // Check if updates include name, matriculeFiscale, password, socialMedia, address, phoneNumber, or domainOfActivity
    if (
      updates.name ||
      updates.matriculeFiscale ||
      updates.password ||
      updates.socialMedia ||
      updates.address ||
      updates.phoneNumber ||
      updates.domainOfActivity
    ) {
      // Update corresponding user with matching email
      await UserCompanyModel.findOneAndUpdate(
        { email: updatedProfileCompany.email },
        { $set: updates }
      );
    }
    delete updates._id;

    return updatedProfileCompany;
  } catch (error) {
    throw error;
  }
};



const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role || !name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    // Ensure valid role
    const validRoles = ["user", "company", "job_seeker"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: `Invalid role. Allowed roles are: ${validRoles.join(', ')}` });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Return response
    return res.status(201).json({
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });

  } catch (error) {
    console.error('Error during user creation:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


//
/*const modifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, role } = req.body;

    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user details
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();

    return res.status(200).json({ message: 'User modified successfully', user });
  } catch (error) {
    console.error('Error modifying user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};*/

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id; // Access the user ID from req.params.id

    const user = await User.findById(userId).select(
      "name image email password role address phone description lastname socialMedia phoneNumber"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Backend: logoutUser function
const logoutUser = (req, res) => {
  try {
    // Effacer le cookie de rafraîchissement
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true, // Assurez-vous que cela correspond aux options de cookie de connexion
      sameSite: "None", // Assurez-vous que cela correspond aux options de cookie de connexion
    });

    // Envoyer une réponse JSON indiquant une déconnexion réussie
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.error("Erreur de déconnexion :", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Accept user by email
const acceptUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { accepted: true } }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User accepted successfully" });
  } catch (error) {
    console.error("Error accepting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Reject user by email
const rejectUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { accepted: false } }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User rejected successfully" });
  } catch (error) {
    console.error("Error rejecting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
 

  rejectUserByEmail,
  acceptUserByEmail,
  getAllJobSeekerProfiles,

  registerUserCompany,
  loginUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  loginLimiter,
  speedLimiter,
  registerUser,
  getUsers,
  getUserCompany,
  createUser,
  getUserById,
  acceptUserByEmail,
  rejectUserByEmail,
  logoutUser,

  getUserCompanyProfile,
  getUserByIdd,
  getProfileJobSeekerById,
  getProfileJobSeekerByUserId,
  updateProfileJobSeekerById,
  getProfileCompanyById,
  updateProfileCompany
};
