
const UserModel = require('../models/user');
const UserCompanyModel = require('../models/user-company');

const { comparePassword, hashPassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');  
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const passport = require('passport');
const InstagramStrategy = require('passport-instagram').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;


//ajouter un user quelconque( pour l'admin peut etre)
const registerUser = async (req, res) => {
  try {
    const { name,email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role||!name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already taken' });
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
    console.error('Error during user registration:', error);}
  }



// Import the transporter configuration (make sure the path is correct)
const transporter = require('../nodemailer-config');
;const registerUserCompany = async (req, res) => {
  try {
    const { name, email, password, matriculeFiscale, description, socialMedia, address, phoneNumber, domainOfActivity } = req.body;

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
    domainOfActivity
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
    domainOfActivity
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

  return { valid: true };
};


// Set up rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per windowMs
  message: 'Too many login attempts, please try again later.',
});
///// new version
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 3, // After 3 requests within windowMs, delay subsequent requests
  delayMs: () => 1000 // 1 second delay for all requests
});


///// login with Protection Against Brute Force Attacks

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user based on the provided email
    const user = await UserModel.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const match = await comparePassword(password, user.password);

    // Check if the passwords match
    if (!match) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    // Generate access token
    const accessToken = jwt.sign(
      { email: user.email, id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1m' } // Adjust the expiration time as needed
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { email: user.email, id: user._id,role:user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' } // Adjust the expiration time as needed
    );

    // Set both tokens as HTTP-only cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true, // other cookie options as needed
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // other cookie options as needed
    });

    // Return the access token in the response
    res.status(200).json({ accessToken, user });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Refresh token
const refreshAccessToken = (req, res) => {
  try {
    // Get the refresh token from the HTTP-only cookie
    const refreshToken = req.cookies.refreshToken;
    console.log('Received Refresh Token:', refreshToken);

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log('Decoded Refresh Token:', decoded);

    // Generate a new access token
    const accessToken = jwt.sign(
      { email: decoded.email, id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Adjust the expiration time as needed
    );

    // Return the new access token
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Refresh Token Error:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Utilisateur non trouvé' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1 hour expiration

    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;

    await user.save();

    const resetLink = `http://votre_application.com/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: 'ikram.hannechi@esprit.tn',
      to: email,
      subject: 'Réinitialisation de mot de passe',
      text: `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erreur d\'envoi de l\'e-mail :', error);
        return res.status(500).json({ error: 'Erreur interne du serveur' });
      }
      console.log('E-mail envoyé :', info.response);
      res.status(200).json({ message: 'Lien de réinitialisation du mot de passe envoyé à votre e-mail' });
    });
  } catch (error) {
    console.error('Erreur de mot de passe oublié :', error);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
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
      console.error('Invalid or expired reset token:', resetToken);
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Configure Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: '443118344822988',
  clientSecret: '9c74042f8ac329b9b7234ed887abe66c',
  callbackURL: 'http://localhost:5173/auth/facebook/callback' // Adjust the callback URL as needed
}, (accessToken, refreshToken, profile, done) => {
  // Handle user data returned by Facebook and save it in your database
  return done(null, profile);
}));



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
    res.status(500).send('Error retrieving users');
  }


 
  
};

const getUserCompany = async (req, res) => {
  try {
    const users = await UserCompanyModel.find();
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving users');
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

*/

module.exports = {

  registerUserCompany,
  loginUser,
  refreshAccessToken,
  forgotPassword, 
  resetPassword,
  loginLimiter,
  speedLimiter,
  registerUser,
  getUsers,
  getUserCompany
 
  

};